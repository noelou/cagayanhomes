import WhyCard from "./WhyCard.jsx";
import './WhyWorkWithMe.css'

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
                    <WhyCard 
                        title="Personal Service"
                        text="You work directly with me, not a call center. Every question gets a real answer."
                    />
                    
                    <WhyCard 
                        title="Local Knowledge"
                        text="Years of experience in the local market means better guidance on price and location."
                    />
                </div>
            </div>
        </section>
    )
}

export default WhyWorkWithMe