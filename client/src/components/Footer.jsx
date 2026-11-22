import { Link } from 'react-router'
import { useContent } from './ContentProvider.jsx'
import './Footer.css'

function Footer() {
    const { agent } = useContent().content

    return (
        <footer className="footer">
            <div className="container footer__inner">
                <div>
                    <img src="/logo-light.png" alt="Carl Real Estate" className="footer__logo" />
                    <p>Helping buyers and sellers in Cagayan de Oro make confident real estate decisions.</p>
                </div>

                <div className="footer__col">
                    <h4>Navigate</h4>
                    <Link to="/buy">Buy</Link>
                    <Link to="/rent">Rent</Link>
                    <Link to="/about">About Me</Link>
                    <Link to="/contact">Contact</Link>
                </div>

                <div className="footer__col">
                    <h4>Get in Touch</h4>
                    <p className="footer__item">Have a question about a property?</p>
                    <Link to="/contact" className="btn btn--outline-light footer__btn">Contact us</Link>
                    <a href={`tel:${agent.phoneDisplay.replace(/\s/g, '')}`} className="footer__item footer__phone">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
                        {agent.phoneDisplay}
                    </a>
                </div>
            </div>

            <div className="footer__bottom">
                <div className="container">
                    &copy; {new Date().getFullYear()} Carl Real Estate. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer