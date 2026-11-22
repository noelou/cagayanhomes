import WhyCard from "./WhyCard.jsx";
import { useContent } from './ContentProvider.jsx'
import './WhyWorkWithMe.css'

function WhyWorkWithMe() {
    const { content } = useContent()
    const { why } = content

    return (
        <section className="section">
            <div className="container">
                <div className="section-heading">
                    <h2>{why.title}</h2>
                    <p>{why.text}</p>
                </div>
                <div className="grid grid--2 why-grid">
                    {why.reasons.map((reason) => (
                        <WhyCard key={reason.title} title={reason.title} text={reason.text} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default WhyWorkWithMe