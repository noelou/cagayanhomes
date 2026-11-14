import { useParams, Link } from 'react-router'
import { properties } from '../data/properties.js'
import PropertyGallery from '../components/PropertyGallery.jsx'

function PropertyDetails() {
    const { id } = useParams()
    const property = properties.find((p) => p.id === id)

    if(!property) {
        return(
            <section className="section">
                <div className="container">
                    <h1>Property not found</h1>
                    <p>This listing may have been removed.</p>
                    <Link to="/buy" className="btn btn--primary">Back to listings</Link>
                </div>
            </section>
        )
    }

    return (
        <section className="section">
            <div className="container">
                <PropertyGallery images={property.images} title={property.title} />
                <h1>{property.title}</h1>
                <p>{property.location}</p>
                <p>₱{property.price.toLocaleString()}</p>
                <p>{property.bedrooms} Beds · {property.bathrooms} Baths</p>
            </div>
        </section>
    )
}

export default PropertyDetails