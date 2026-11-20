import requireAdmin from './auth.js'
import express from 'express'
import pool from './db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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