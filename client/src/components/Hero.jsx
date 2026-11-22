import { useContent } from './ContentProvider.jsx'
import './Hero.css'

function Hero() {
    const { content } = useContent()

    return (
        <section className="hero">
            <div className="container hero__inner">
                <h1>{content.hero.title}</h1>
                <p>{content.hero.text}</p>
                <div className="hero__actions">
                    <a href="/buy" className="btn btn--light">I'm Buying</a>
                    <a
                        href={content.hero.sellingLink || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--outline-light"
                    >
                        I'm Selling
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Hero
