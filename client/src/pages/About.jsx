import carlPhoto from '../assets/carl-prof.jpg'
import { agent } from '../data/agent.js'
import './About.css'

function About() {
    return (
        <section className="section">
            <div className="container about">
                <div className="about__image">
                    <img src={carlPhoto} alt={agent.name} className="about__photo" />
                </div>

                <div className="about__text">
                    <h1>About {agent.name}</h1>
                    <p>
                        I'm {agent.name}, a real estate agent based in {agent.location}.
                        I help families, first-time buyers, and property owners find the
                        right place and close the deal with less stress.
                    </p>
                    <p>
                        From viewing properties to negotiating and completing the paperwork,
                        I'll guide you through every step.
                    </p>

                    <ul className="about__contact">
                        <li>
                            <strong>Phone:</strong>{' '}
                            <a href={`tel:${agent.phoneDisplay.replace(/\s/g, '')}`}>{agent.phoneDisplay}</a>
                        </li>
                        <li>
                            <strong>Email:</strong>{' '}
                            <a href={`mailto:${agent.email}`}>{agent.email}</a>
                        </li>
                        <li>
                            <strong>Location:</strong> {agent.location}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default About
