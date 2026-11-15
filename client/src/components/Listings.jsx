import { useState, useEffect } from 'react'
import PropertyCard from './PropertyCard.jsx'

function Listings({ type, title, subtitle }) {
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProperties() {
            const res = await fetch('/api/properties')
            const data = await res.json()
            setProperties(data)
            setLoading(false)
        }
        loadProperties()
    }, [])
    
    const filtered = properties.filter((p) => p.type === type)

    return (
        <section className="section">
            <div className="container">
                <div className="section-heading">
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>

                {loading && <p>Loading properties...</p>}
                <div className="grid grid--3">
                    {filtered.map((p) => (
                        <PropertyCard key={p.id} {...p} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Listings