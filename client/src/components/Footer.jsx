import { Link } from 'react-router'
import { agent } from '../data/agent.js'
import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="container footer__inner">
                <div>
                    <h3>Carl <span>Real Estate</span></h3>
                    <p>Helping buyers and sellers in Cagayan de Oro make confident real estate decisions.</p>
                </div>

                <div className="footer__col">
                    <h4>Navigate</h4>
                    <Link to="/">Home</Link>
                    <Link to="/buy">Buy</Link>
                    <Link to="/rent">Rent</Link>
                    <Link to="/about">About Me</Link>
                    <Link to="/contact">Contact</Link>
                </div>

                <div className="footer__col">
                    <h4>Get in Touch</h4>
                    <p>📞 {agent.phoneDisplay}</p>
                    <p>📧 {agent.email}</p>
                    <p>📍 {agent.location}</p>
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