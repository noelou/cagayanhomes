import { useState } from 'react'
import { useNavigate } from 'react-router'
import './Contact.css'

function AdminLogin() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })

        if (!res.ok) {
            setError('Invalid username or password')
            return
        }

        const data = await res.json()
        localStorage.setItem('token', data.token)
        navigate('/admin')
    }

    return (
        <section className="section">
            <div className="container">
                <form onSubmit={handleSubmit} className="contact__form">
                    <h1>Admin login</h1>
                    <div className="field">
                        <label htmlFor="email">Username</label>
                        <input id="email" type="text" name="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" name="password" value={form.password} onChange={handleChange} required />
                    </div>
                    {error && <p>{error}</p>}
                    <button type="submit" className="btn btn--primary">Log in</button>
                </form>
            </div>
        </section>
    )
}

export default AdminLogin