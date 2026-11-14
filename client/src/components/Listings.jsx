import PropertyCard from './PropertyCard.jsx'
import { properties } from '../data/properties.js'

function Listings({ type, title, subtitle }) {
    const filtered = properties.filter((p) => p.type === type)

    return (
        <section className="section">
            <div className="container">
                <div className="section-heading">
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>

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