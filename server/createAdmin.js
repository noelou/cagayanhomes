import bcrypt from 'bcrypt'
import pool from './db.js'

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
    console.log('Usage: node --env-file=.env createAdmin.js <email> <password>')
    process.exit(1)
}

const hash = await bcrypt.hash(password, 10)

await pool.query(
    `INSERT INTO admins (email, password_hash)
    VALUES ($1, $2)
    ON CONFLICT (email) DO NOTHING`,
    [email, hash]
)

console.log('Admin created:', email)
await pool.end()