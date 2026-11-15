import './Hero.css'

function Hero() {
    return (
        <section className="hero">
            <div className="container hero__inner">
                <h1>Find a Place You'll Love to Call Home.</h1>
                <p>
                    Buying or selling a home can feel overwhelming. I'm here to make it easier,
                    from finding the right property to negotiating and completing the paperwork.
                </p>
                <div className="hero__actions">
                    <a href="/buy" className="btn btn--light">I'm Buying</a>
                    <a href="/contact" className="btn btn--outline-light">I'm Selling</a>
                </div>
            </div>
        </section>
    )
}

export default Hero
