import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import PropertyGallery from '../components/PropertyGallery.jsx'
import { getCachedProperty, fetchProperty } from '../data/propertyCache.js'
import './PropertyDetails.css'

function PropertyDetails() {
    const { id } = useParams()
    const [property, setProperty] = useState(() => getCachedProperty(id))
    const [loading, setLoading] = useState(() => getCachedProperty(id) === null)
    const [notFound, setNotFound] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        async function loadProperty() {
            // show the cached copy right away, then refresh it from the server
            const cached = getCachedProperty(id)
            setProperty(cached)
            setLoading(cached === null)
            setNotFound(false)
            setError(false)

            try {
                const data = await fetchProperty(id)
                if (data === null) {
                    setProperty(null)
                    setNotFound(true)
                } else {
                    setProperty(data)
                }
            } catch {
                if (cached === null) setError(true)
            }
            setLoading(false)
        }
        loadProperty()
    }, [id])

    if(error) {
        return(
            <section className="section">
                <div className="container">
                    <p>Sorry, we couldn't load this property right now. Please try again in a moment.</p>
                </div>
            </section>
        )
    }

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

                <Link to={`/contact?property=${property.id}`} className="btn btn--primary no-print">
                    Inquire about this property
                </Link>{' '}
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