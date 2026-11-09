import TestimonialCard from "./TestimonialCard.jsx"
import { testimonials } from "../data/testimonials"
import './ClientStories.css'

function ClientStories() {
    return (
        <section className="section">
            <div className="container">
                <div className="section-heading">
                    <h2>What My Clients Say</h2>
                </div>
                <div className="grid grid--3">
                    {testimonials.map((t) => (
                        <TestimonialCard key={t.name} name={t.name} detail={t.detail} quote={t.quote} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ClientStories