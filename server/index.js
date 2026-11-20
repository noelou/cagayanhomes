import requireAdmin from './auth.js'
import express from 'express'
import pool from './db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'

const app = express()
const PORT = 5000
app.use(express.json())

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
            lot_area, floor_area, bed_frame, sofa_set, refrigerator, map_query)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING ${COLUMNS}`,
        [
            id, p.title, p.type, p.price, p.location, p.bedrooms, p.bathrooms,
            p.lotArea, p.floorArea, p.bedFrame, p.sofaSet, p.refrigerator, p.mapQuery,
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
            map_query = COALESCE($12, map_query)
        WHERE id = $13
        RETURNING ${COLUMNS}`,
        [
            p.title, p.type, p.price, p.location, p.bedrooms, p.bathrooms,
            p.lotArea, p.floorArea, p.bedFrame, p.sofaSet, p.refrigerator, p.mapQuery,
            req.params.id,
        ]
    )

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Property Not Found' })
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

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})

const COLUMNS = `
    id, title, type, price::float AS price, location, bedrooms, bathrooms,
    lot_area AS "lotArea", floor_area AS "floorArea",
    bed_frame AS "bedFrame", sofa_set AS "sofaSet", refrigerator,
    thumbnail, images
`