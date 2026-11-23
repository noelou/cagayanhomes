import { useEffect } from 'react'
import InquiryForm from './InquiryForm.jsx'
import './InquiryModal.css'

function InquiryModal({ open, onClose, propertyId, title }) {
    useEffect(() => {
        if (!open) return

        function handleKey(e) {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleKey)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleKey)
            document.body.style.overflow = ''
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="modal no-print" onClick={onClose}>
            <div
                className="modal__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="inquiry-title"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal__close" onClick={onClose} aria-label="Close">
                    ×
                </button>
                <h2 id="inquiry-title">Inquire about {title}</h2>
                <InquiryForm propertyId={propertyId} />
            </div>
        </div>
    )
}

export default InquiryModal
