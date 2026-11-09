function TestimonialCard({ name, detail, quote }) {
    return (
        <div className="testimonial card">
            <p className="testimonial__quote">&ldquo;{quote}&rdquo;</p>
            <p className="testimonial__name">{name}</p>
            <p className="testimonial__detail">{detail}</p>
        </div>
    )
}

export default TestimonialCard