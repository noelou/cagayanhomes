import TestimonialCard from "./TestimonialCard.jsx"
import { useContent } from './ContentProvider.jsx'
import './ClientStories.css'

function ClientStories() {
    const { content } = useContent()
    const testimonials = content.testimonials

    if (testimonials.length === 0) return null

    return (
        <section className="section">
            <div className="container">
                <div className="section-heading">
                    <h2>What My Clients Say</h2>
                </div>
                <div className="grid grid--3">
                    {testimonials.map((t) => (
                        <TestimonialCard key={`${t.name}-${t.quote}`} name={t.name} detail={t.detail} quote={t.quote} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ClientStories