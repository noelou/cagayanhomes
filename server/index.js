import multer from 'multer'
import sharp from 'sharp'
import fs from 'node:fs/promises'
import requireAdmin from './auth.js'
import express from 'express'
import pool from './db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'

const app = express()
const PORT = 5000
app.use(express.json())
app.use('/uploads', express.static('uploads'))

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/')),
})

app.get('/api/hello', (req, res) => {
    res.json({message: 'Hello from the server'})
})

app.get('/api/properties', async (req, res) => {
    const result = await pool.query(`SELECT ${COLUMNS} FROM properties`)
    res.json(result.rows)
})

app.get('/api/properties/:id', async (req, res) => {
    const result = await pool.query(
        `SELECT ${COLUMNS} FROM properties WHERE id = $1`,
        [req.params.id]
    )

    if (result.rows.length === 0) {
        return res.status(404).json({message: 'Property Not Found'})
    }

    res.json(result.rows[0])
})

app.delete('/api/properties/:id', requireAdmin, async (req, res) => {
    const result = await pool.query(
        'DELETE FROM properties WHERE id = $1 RETURNING id',
        [req.params.id]
    )

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Property Not Found' })
    }

    await fs.rm(`uploads/${result.rows[0].id}`, { recursive: true, force: true })

    res.json({ message: 'Deleted', id: result.rows[0].id })
})

app.post('/api/properties', requireAdmin, async (req, res) => {
    const p = req.body

    if (!p.title || !p.location || !p.price || !['sale', 'rent'].includes(p.type)) {
        return res.status(400).json({ message: 'title, type (sale/rent), price and location are required' })
    }

    const id = randomUUID()

    const result = await pool.query(
        `INSERT INTO properties
        (id, title, type, price, location, bedrooms, bathrooms,
            lot_area, floor_area, bed_frame, sofa_set, refrigerator, map_query, seller_phone)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, $14)
        RETURNING ${ADMIN_COLUMNS}`,
        [
            id, p.title, p.type, p.price, p.location, p.bedrooms, p.bathrooms,
            p.lotArea, p.floorArea, p.bedFrame, p.sofaSet, p.refrigerator, p.mapQuery, p.sellerPhone
        ]
    )

    res.status(201).json(result.rows[0])
})

app.put('/api/properties/:id', requireAdmin, async (req, res) => {
    const p = req.body

    if (!p.title || !p.location || !p.price || !['sale', 'rent'].includes(p.type)) {
        return res.status(400).json({ message: 'title, type (sale/rent), price and location are required' })
    }

    const result = await pool.query(
        `UPDATE properties SET
            title = $1, type = $2, price = $3, location = $4,
            bedrooms = $5, bathrooms = $6, lot_area = $7, floor_area = $8,
            bed_frame = COALESCE($9, bed_frame),
            sofa_set = COALESCE($10, sofa_set),
            refrigerator = COALESCE($11, refrigerator),
            map_query = COALESCE($12, map_query),
            seller_phone = $13
        WHERE id = $14
        RETURNING ${ADMIN_COLUMNS}`,
        [
            p.title, p.type, p.price, p.location, p.bedrooms, p.bathrooms,
            p.lotArea, p.floorArea, p.bedFrame, p.sofaSet, p.refrigerator, p.mapQuery,
            p.sellerPhone,
            req.params.id,
        ]
    )

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Property Not Found' })
    }

    res.json(result.rows[0])
})

app.post('/api/properties/:id/photos', requireAdmin, upload.array('photos', 10), async (req, res) => {
    const id = req.params.id

    const found = await pool.query('SELECT id FROM properties WHERE id = $1', [id])
    if (found.rows.length === 0) {
        return res.status(404).json({ message: 'Property Not Found' })
    }

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No image files received' })
    }

    const folder = `uploads/${id}`
    await fs.mkdir(folder, { recursive: true })

    const urls = []
    for (const file of req.files) {
        const name = `${randomUUID()}.webp`
        await sharp(file.buffer)
            .rotate()
            .resize({ width: 1600, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(`${folder}/${name}`)
        urls.push(`/uploads/${id}/${name}`)
    }

    const result = await pool.query(
        `UPDATE properties SET
            images = COALESCE(images, '{}') || $1::text[],
            thumbnail = COALESCE(thumbnail, $2)
        WHERE id = $3
        RETURNING ${ADMIN_COLUMNS}`,
        [urls, urls[0], id]
    )

    res.status(201).json(result.rows[0])
})

app.delete('/api/properties/:id/photos', requireAdmin, async (req, res) => {
    const id = req.params.id
    const url = req.query.url

    const found = await pool.query(
        'SELECT images, thumbnail FROM properties WHERE id = $1',
        [id]
    )
    if (found.rows.length === 0) {
        return res.status(404).json({ message: 'Property Not Found' })
    }

    const images = found.rows[0].images || []
    const thumbnail = found.rows[0].thumbnail

    if (!images.includes(url)) {
        return res.status(404).json({ message: 'Photo not found' })
    }

    const remaining = images.filter((u) => u !== url)
    const newThumbnail = thumbnail === url ? (remaining[0] ?? null) : thumbnail

    const result = await pool.query(
        `UPDATE properties SET images = $1, thumbnail = $2
        WHERE id = $3
        RETURNING ${ADMIN_COLUMNS}`,
        [remaining, newThumbnail, id]
    )

    if (url.startsWith(`/uploads/${id}/`)) {
        await fs.rm(`.${url}`, { force: true })
    }

    res.json(result.rows[0])
})

app.put('/api/properties/:id/cover', requireAdmin, async (req, res) => {
    const result = await pool.query(
        `UPDATE properties SET thumbnail = $1
        WHERE id = $2 AND $1 = ANY(images)
        RETURNING ${ADMIN_COLUMNS}`,
        [req.body.url, req.params.id]
    )

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Photo not found for this listing' })
    }

    res.json(result.rows[0])
})

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body

    const result = await pool.query(
        'SELECT id, email, password_hash FROM admins WHERE email = $1',
        [email]
    )

    const admin = result.rows[0]
    if (!admin) {
        return res.status(401).json({ message: 'Invalid login' })
    }

    const match = await bcrypt.compare(password, admin.password_hash)
    if (!match) {
        return res.status(401).json({ message: 'Invalid login' })
    }

    const token = jwt.sign(
        { id: admin.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    res.json({ token })
})

app.get('/api/admin/check', requireAdmin, (req, res) => {
    res.json({ message: 'You are admin', adminId: req.adminId })
})

app.get('/api/admin/properties', requireAdmin, async (req, res) => {
    const result = await pool.query(`SELECT ${ADMIN_COLUMNS} FROM properties`)
    res.json(result.rows)
})

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})

const COLUMNS = `
    id, title, type, price::float AS price, location, bedrooms, bathrooms,
    lot_area AS "lotArea", floor_area AS "floorArea",
    bed_frame AS "bedFrame", sofa_set AS "sofaSet", refrigerator,
    thumbnail, images
`

const ADMIN_COLUMNS = `${COLUMNS}, seller_phone AS "sellerPhone"`