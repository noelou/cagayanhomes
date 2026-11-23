import { useState } from 'react'

const emptyForm = { name: '', email: '', phone: '', message: '', website: '' }

function InquiryForm({ propertyId, onSent }) {
    const [form, setForm] = useState(emptyForm)
    const [status, setStatus] = useState('idle') // idle | sending | sent | error
    const [error, setError] = useState('')

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setStatus('sending')
        setError('')

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, propertyId }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                setError(data.message || 'Something went wrong. Please try again.')
                setStatus('error')
                return
            }

            setForm(emptyForm)
            setStatus('sent')
            if (onSent) onSent()
        } catch {
            setError('Could not reach the server. Please try again.')
            setStatus('error')
        }
    }

    return (
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

            <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <label htmlFor="website">Leave this empty</label>
                <input id="website" type="text" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
            </div>

            {status === 'sent' && <p role="status">Thank you! Your message was sent. I'll get back to you soon.</p>}
            {status === 'error' && <p role="alert">{error}</p>}

            <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
        </form>
    )
}

export default InquiryForm