import './PropertyCard.css'
import { Link } from 'react-router'

function PropertyCard({ id, title, type, price, location, bedrooms, bathrooms, lotArea, thumbnail }) {
    return (
        <Link to={`/property/${id}`} className="property-card card">
            <img src={thumbnail} alt={title} className="property-card__image" />

            <div className="property-card__body">
                <p className="property-card__price">
                    ₱{price.toLocaleString()}
                    {type === 'rent' && <span className="property-card__period"> / month</span>}
                </p>
                <h3>{title}</h3>
                <p className="property-card__location">{location}</p>

                <div className="property-card__details">
                    <span>{bedrooms} Beds</span>
                    <span>{bathrooms} Baths</span>
                    {lotArea && <span>{lotArea}</span>}
                </div>
            </div>
        </Link>
    )
}

export default PropertyCard