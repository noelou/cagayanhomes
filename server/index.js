import multer from 'multer'
import sharp from 'sharp'
import fs from 'node:fs/promises'
import requireAdmin from './auth.js'
import express from 'express'
import rateLimit from 'express-rate-limit'
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

const inquiryLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many messages. Please try again later.' },
})

app.post('/api/inquiries', inquiryLimiter, async (req, res) => {
    const { name, email, phone, message, propertyId, website } = req.body ?? {}

    // Honeypot: real users never fill this hidden field. Pretend success, save nothing.
    if (website) {
        return res.status(201).json({ message: 'Sent' })
    }

    const isStr = (v) => typeof v === 'string'
    if (!isStr(name) || !isStr(email) || !isStr(message) ||
        (phone != null && !isStr(phone)) || (propertyId != null && !isStr(propertyId))) {
        return res.status(400).json({ message: 'Invalid input' })
    }

    const n = name.trim()
    const e = email.trim()
    const m = message.trim()
    const ph = phone ? phone.trim() : null

    if (!n || !e || !m) {
        return res.status(400).json({ message: 'Name, email and message are required' })
    }
    if (n.length > 100 || e.length > 200 || m.length > 2000 || (ph && ph.length > 30)) {
        return res.status(400).json({ message: 'One of the fields is too long' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
        return res.status(400).json({ message: 'Please enter a valid email' })
    }

    await pool.query(
        `INSERT INTO inquiries (name, email, phone, message, property_id)
        VALUES ($1, $2, $3, $4, (SELECT id FROM properties WHERE id = $5))`,
        [n, e, ph || null, m, propertyId || null]
    )

    res.status(201).json({ message: 'Sent' })
})

app.get('/api/admin/inquiries', requireAdmin, async (req, res) => {
    const result = await pool.query(
        `SELECT i.id, i.name, i.email, i.phone, i.message, i.is_read AS "isRead",
            i.created_at AS "createdAt", i.property_id AS "propertyId", p.title AS "propertyTitle"
        FROM inquiries i
        LEFT JOIN properties p ON p.id = i.property_id
        ORDER BY i.created_at DESC`
    )
    res.json(result.rows)
})

app.put('/api/admin/inquiries/:id/read', requireAdmin, async (req, res) => {
    const isRead = req.body?.isRead !== false
    const result = await pool.query(
        'UPDATE inquiries SET is_read = $1 WHERE id = $2 RETURNING id, is_read AS "isRead"',
        [isRead, req.params.id]
    )
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Inquiry Not Found' })
    }
    res.json(result.rows[0])
})

app.delete('/api/admin/inquiries/:id', requireAdmin, async (req, res) => {
    const result = await pool.query(
        'DELETE FROM inquiries WHERE id = $1 RETURNING id',
        [req.params.id]
    )
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Inquiry Not Found' })
    }
    res.json({ message: 'Deleted', id: result.rows[0].id })
})

// ---- Editable site content (agent info, hero, about, testimonials ...) ----
const text = (max, min = 1) => ({ kind: 'string', max, min })
const obj = (fields) => ({ kind: 'object', fields })
const list = (item, max) => ({ kind: 'array', item, max })

const CONTENT_SPECS = {
    agent: obj({ name: text(100), email: text(200), phoneDisplay: text(40), location: text(200) }),
    hero: obj({ title: text(150), text: text(600) }),
    why: obj({
        title: text(100),
        text: text(600),
        reasons: list(obj({ title: text(100), text: text(400) }), 8),
    }),
    about: obj({ text: text(4000) }),
    buy: obj({ title: text(100), subtitle: text(300) }),
    rent: obj({ title: text(100), subtitle: text(300) }),
    testimonials: list(obj({ name: text(100), detail: text(200, 0), quote: text(800) }), 12),
}

function cleanValue(spec, v) {
    if (spec.kind === 'string') {
        if (typeof v !== 'string') return undefined
        const s = v.trim()
        if (s.length < spec.min || s.length > spec.max) return undefined
        return s
    }
    if (spec.kind === 'object') {
        if (!v || typeof v !== 'object' || Array.isArray(v)) return undefined
        const out = {}
        for (const [k, s] of Object.entries(spec.fields)) {
            const c = cleanValue(s, v[k])
            if (c === undefined) return undefined
            out[k] = c
        }
        return out
    }
    if (!Array.isArray(v) || v.length > spec.max) return undefined
    const out = []
    for (const item of v) {
        const c = cleanValue(spec.item, item)
        if (c === undefined) return undefined
        out.push(c)
    }
    return out
}

app.get('/api/content', async (req, res) => {
    const result = await pool.query('SELECT key, value FROM site_content')
    const content = {}
    for (const row of result.rows) content[row.key] = row.value
    res.json(content)
})

app.put('/api/admin/content/:key', requireAdmin, async (req, res) => {
    const spec = Object.hasOwn(CONTENT_SPECS, req.params.key) ? CONTENT_SPECS[req.params.key] : null
    if (!spec) {
        return res.status(404).json({ message: 'Unknown content section' })
    }

    const value = cleanValue(spec, req.body?.value)
    if (value === undefined) {
        return res.status(400).json({ message: 'Some fields are empty or too long' })
    }

    if (req.params.key === 'agent' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
        return res.status(400).json({ message: 'Please enter a valid email' })
    }

    await pool.query(
        `INSERT INTO site_content (key, value) VALUES ($1, $2::jsonb)
        ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, updated_at = NOW()`,
        [req.params.key, JSON.stringify(value)]
    )

    res.json(value)
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