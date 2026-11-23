import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import PropertyGallery from '../components/PropertyGallery.jsx'
import InquiryModal from '../components/InquiryModal.jsx'
import { getCachedProperty, fetchProperty } from '../data/propertyCache.js'
import './PropertyDetails.css'

const OWNERSHIP_LABELS = { clean_title: 'Clean title', mortgage: 'Mortgage' }
const AVAILABILITY_LABELS = { available: 'Available', reserved: 'Reserved', sold: 'Sold' }
const PAYMENT_LABELS = { cash: 'Cash', installment: 'Installment' }

function PropertyDetails() {
    const { id } = useParams()
    const [property, setProperty] = useState(() => getCachedProperty(id))
    const [loading, setLoading] = useState(() => getCachedProperty(id) === null)
    const [notFound, setNotFound] = useState(false)
    const [error, setError] = useState(false)
    const [showInquiry, setShowInquiry] = useState(false)

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

    // Exact pin when the listing has coordinates; otherwise search by the location text.
    const hasCoords = property.latitude != null && property.longitude != null
    const mapQuery = hasCoords
        ? `${property.latitude},${property.longitude}`
        : property.mapQuery || property.location

    // "For sale" details: only the ones the admin filled in are shown.
    const peso = (n) => `₱${Number(n).toLocaleString()}`
    const saleRows = []
    if (property.ownershipStatus) {
        saleRows.push(['Ownership status', OWNERSHIP_LABELS[property.ownershipStatus]])
    }
    if (property.availability) {
        saleRows.push(['Availability', AVAILABILITY_LABELS[property.availability]])
    }
    if (property.paymentTerms) {
        saleRows.push(['Payment terms', PAYMENT_LABELS[property.paymentTerms]])
    }
    if (property.paymentTerms === 'installment') {
        if (property.downpayment != null) saleRows.push(['Downpayment', peso(property.downpayment)])
        if (property.monthlyPayment != null) saleRows.push(['Per month', peso(property.monthlyPayment)])
        if (property.paymentNote) saleRows.push(['Note', property.paymentNote])
    }
    if (property.financing != null) {
        saleRows.push(['Financing', property.financing ? 'Yes' : 'No'])
    }
    if (property.requirements) saleRows.push(['Requirements', property.requirements])
    if (property.amenities) saleRows.push(['Amenities', property.amenities])

    // Everything shown in the details list: sizes for every listing, sale terms only for sales.
    const detailRows = []
    if (property.lotArea) detailRows.push(['Lot area', property.lotArea])
    if (property.floorArea) detailRows.push(['Floor area', property.floorArea])
    if (property.type === 'sale') detailRows.push(...saleRows)

    return (
        <section className="section">
            <div className="container">
                <PropertyGallery images={property.images} title={property.title} />
                <h1 className="details__title">{property.title}</h1>
                <p>{property.location}</p>
                <p>₱{property.price.toLocaleString()}</p>
                <p>{property.bedrooms} Beds · {property.bathrooms} Baths</p>

                {detailRows.length > 0 && (
                    <div className="details__sale">
                        <h2>Property details</h2>
                        <dl>
                            {detailRows.map(([label, value]) => (
                                <div key={label} className="details__row">
                                    <dt>{label}</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}

                <button className="btn btn--primary no-print" onClick={() => setShowInquiry(true)}>
                    Inquire about this property
                </button>{' '}
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

                <InquiryModal
                    open={showInquiry}
                    onClose={() => setShowInquiry(false)}
                    propertyId={property.id}
                    title={property.title}
                />
            </div>
        </section>
    )
}

export default PropertyDetails