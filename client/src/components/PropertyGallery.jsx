import { useState } from 'react'
import './PropertyGallery.css'

function PropertyGallery({ images, title }) {
    const [current, setCurrent] = useState(0)
    
    return(
        <div className="gallery">
            <div className="gallery__main">
                <img src={images[current]} alt={`${title} photo ${current + 1}`} />
            </div>

            <div className="gallery__thumbs">
                {images.map((src, index) => (
                    <button
                        key={src}
                        className={index === current ? 'gallery__thumb gallery__thumb--active' : 'gallery__thumb'}
                        onClick={() => setCurrent(index)}
                    >
                        <img src={src} alt={`${title} thumbnail ${index + 1}`} />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default PropertyGallery