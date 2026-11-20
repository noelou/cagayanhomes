import jwt from 'jsonwebtoken'

export default function requireAdmin(req, res, next) {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Login required' })
    }

    const token = header.slice(7)

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.adminId = payload.id
        next()
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}