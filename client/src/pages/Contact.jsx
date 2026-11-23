import { useContent } from '../components/ContentProvider.jsx'
import { useSearchParams } from 'react-router'
import './Contact.css'
import ClientStories from '../components/ClientStories.jsx'
import InquiryForm from '../components/InquiryForm.jsx'

function Contact() {
    const { agent } = useContent().content
    const [searchParams] = useSearchParams()
    const propertyId = searchParams.get('property')

    return(
        <>
            <section className="section">
                <div className="container contact">
                    <div className="contact__info">
                        <h1>Contact {agent.name}</h1>
                        <p>Have a question or want to view a property? Send a message or call.</p>
                        <ul className="contact__list">
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
                    <InquiryForm propertyId={propertyId} />
                </div>
            </section>
            <ClientStories />
        </>
    )
}

export default Contact