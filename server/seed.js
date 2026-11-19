import pool from './db.js'
import { properties } from './data/properties.js'

for (const p of properties) {
    await pool.query(
        `INSERT INTO properties
        (id, title, type, price, location, bedrooms, bathrooms,
            lot_area, floor_area, bed_frame, sofa_set, refrigerator,
            thumbnail, images)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        ON CONFLICT (id) DO NOTHING`,
        [
        p.id, p.title, p.type, p.price, p.location, p.bedrooms, p.bathrooms,
        p.lotArea, p.floorArea, p.bedFrame, p.sofaSet, p.refrigerator,
        p.thumbnail, p.images,
        ]
    )
}

console.log('Seeded', properties.length, 'properties')
await pool.end()