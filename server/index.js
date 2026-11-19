import express from 'express'
import pool from './db.js'

const app = express()
const PORT = 5000

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

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})

const COLUMNS = `
    id, title, type, price::float AS price, location, bedrooms, bathrooms,
    lot_area AS "lotArea", floor_area AS "floorArea",
    bed_frame AS "bedFrame", sofa_set AS "sofaSet", refrigerator,
    thumbnail, images
`