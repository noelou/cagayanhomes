import { agent } from '../data/agent.js'
import { useState } from 'react'
import './Contact.css'
import ClientStories from '../components/ClientStories.jsx'

function Contact() {
    const [form, setForm] =  useState({ name: '', email: '', phone: '', message: '' })

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()
        console.log(form)
    }

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
                    <form onSubmit={handleSubmit} className="contact__form">
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <input id="name" type="text" name="name" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="field">
                            <label htmlFor="phone">Phone</label>
                            <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" value={form.message} rows="5" onChange={handleChange} required></textarea>
                        </div>

                        <button type="submit" className="btn btn--primary">Send message</button>
                    </form>
                </div>
            </section>
            <ClientStories />
        </>
    )
}

export default Contact