import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import PropertyGallery from '../components/PropertyGallery.jsx'
import './PropertyDetails.css'

function PropertyDetails() {
    const { id } = useParams()
    const [property, setProperty] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        async function loadProperty() {
            const res = await fetch(`/api/properties/${id}`)
            if (res.status === 404) {
                setNotFound(true)
                setLoading(false)
                return
            }
            const data = await res.json()
            setProperty(data)
            setLoading(false)
        }
        loadProperty()
    }, [id])

    if(loading) {
        return(
            <section className="section">
              <div className="container">
                  <p>Loading property...</p>
              </div>
            </section>
        ) 
    }

    if(notFound) {
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

    const mapQuery = property.mapQuery || property.location

    return (
        <section className="section">
            <div className="container">
                <PropertyGallery images={property.images} title={property.title} />
                <h1 className="details__title">{property.title}</h1>
                <p>{property.location}</p>
                <p>₱{property.price.toLocaleString()}</p>
                <p>{property.bedrooms} Beds · {property.bathrooms} Baths</p>

                <button className="btn btn--outline no-print" onClick={() => window.print()}>
                    Print details
                </button>

                {mapQuery && (
                    <div className="details__map no-print">
                        <iframe
                            title={`Map of ${property.title}`}
                            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                            loading="lazy"
                        ></iframe>
                    </div>
                )}
            </div>
        </section>
    )
}

export default PropertyDetails