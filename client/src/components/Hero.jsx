import carlPhoto from '../assets/carl-prof.jpg'
import './Hero.css'

function Hero() {
    return (
        <section className="hero">
            <div className="container hero__inner">
                <div className="hero__text">
                <h1>Find a Place You'll Love to Call Home.</h1>
                <p>
                    Buying or selling a home can feel overwhelming. I'm here to make it easier,
                    from finding the right property to negotiating and completing the paperwork.
                </p>
                <div className="hero__actions">
                    <a href="/buy" className="btn btn--primary">I'm Buying</a>
                    <a href="/sell" className="btn btn--outline">I'm Selling</a>
                </div>
                </div>
                <div className="hero__image">
                <img src={carlPhoto} alt="Carl" className="hero__photo" />
                </div>
            </div>
        </section>
    )
}

export default Hero