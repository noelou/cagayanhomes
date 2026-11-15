import express from 'express'
import { properties } from './data/properties.js'

const app = express()
const PORT = 5000

app.get('/api/hello', (req, res) => {
    res.json({message: 'Hello from the server'})
})

app.get('/api/properties', (req, res) => {
    res.json(properties)
})

app.get('/api/properties/:id', (req, res) => {
    const property = properties.find((p) => p.id === req.params.id)

    if (!property) {
        return res.status(404).json({message: 'Property Not Found'})
    }

    res.json(property)
})

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})