import { Link, NavLink } from 'react-router'
import './Header.css'

function Header() {
    return (
        <header className="navbar">
            <div className="container navbar__inner">
                <Link to="/" className="navbar__logo">
                    Carl <span>Real Estate</span>
                </Link>

                <nav className="navbar__links">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/buy">Buy</NavLink>
                    <NavLink to="/rent">Rent</NavLink>
                    <NavLink to="/about">About Me</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                    <Link to="/contact" className="btn btn--gold navbar__cta">
                        📅 Book a Consultation
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default Header