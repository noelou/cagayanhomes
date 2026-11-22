import { Link } from 'react-router'
import carlPhoto from '../assets/carl-prof.jpg'
import { useContent } from '../components/ContentProvider.jsx'
import './About.css'
import ClientStories from '../components/ClientStories.jsx'

function About() {
    const { agent, about } = useContent().content
    const paragraphs = about.text.split(/\n\s*\n/).filter(Boolean)

    return (
        <>
            <section className="section">
                <div className="container about">
                    <div className="about__image">
                        <img src={carlPhoto} alt={agent.name} className="about__photo" />
                    </div>

                    <div className="about__text">
                        <h1>About {agent.name}</h1>
                        {paragraphs.map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}

                        <Link to="/contact" className="btn btn--primary about__cta">Contact me</Link>
                    </div>
                </div>
            </section>
            <ClientStories />
        </>
    )
}

export default About
