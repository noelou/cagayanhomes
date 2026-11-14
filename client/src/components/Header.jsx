import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import './Header.css'

function Header() {
    const [isOpen, setIsOpen] = useState(false)

    const closeMenu = () => {
        setIsOpen(false)
    }

    return (
        <header className="navbar">
            <div className="container navbar__inner">
                <Link to="/" className="navbar__logo" onClick={closeMenu}>
                    Carl <span>Real Estate</span>
                </Link>

                <button className="navbar__toggle" onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav 
                    className={isOpen ? 'navbar__links navbar__links--open' : 'navbar__links'}
                    onClick={closeMenu}
                >
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