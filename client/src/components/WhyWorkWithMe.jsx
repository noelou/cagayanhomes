import WhyCard from "./WhyCard.jsx";
import './WhyWorkWithMe.css'

const reasons = [
    { title: 'Personal Service', text: 'You work directly with me, not a call center. Every question gets a real answer.' },
    { title: 'Local Knowledge', text: 'Years of experience in the local market means better guidance on price and location.' },
    { title: 'Honest Guidance', text: "No pressure, no upselling — just straightforward advice about what's right for you." },
    { title: 'End-to-End Support', text: "From your first inquiry to signing the final paperwork, I'll be with you the whole way." }
]

function WhyWorkWithMe() {
    return (
        <section className="section">
            <div className="container">
                <div className="section-heading">
                    <h2>Why Work With Me?</h2>
                    <p>Buying or selling a home can feel overwhelming. I'm here to make it easier,
                          guiding you through each step from the first conversation to closing.</p>
                </div>
                <div className="grid grid--2 why-grid">
                    {reasons.map((reason) => (
                        <WhyCard key={reason.title} title={reason.title} text={reason.text} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default WhyWorkWithMe