import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import './Admin.css'

 const emptyForm = {
    title: '', type: 'sale', price: '', location: '',
    bedrooms: '', bathrooms: '', lotArea: '', floorArea: '',
}

function Admin() {
    const navigate = useNavigate()
    const [properties, setProperties] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        async function loadProperties() {
            const res = await fetch('/api/properties')
            const data = await res.json()
            setProperties(data)
        }
        loadProperties()
    }, [])

    function handleLogout() {
        localStorage.removeItem('token')
        navigate('/admin/login')
    }

    async function handleDelete(id) {
        if (!confirm('Delete this listing? This cannot be undone.')) return

        const res = await fetch(`/api/properties/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })

        if (!res.ok) {
            alert('Could not delete. Please log in again.')
            return
        }

        setProperties(properties.filter((p) => p.id !== id))
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleEdit(p) {
        setEditingId(p.id)
        setForm({
            title: p.title,
            type: p.type,
            price: p.price,
            location: p.location,
            bedrooms: p.bedrooms ?? '',
            bathrooms: p.bathrooms ?? '',
            lotArea: p.lotArea ?? '',
            floorArea: p.floorArea ?? '',
        })
    }

    function handleCancel() {
        setEditingId(null)
        setForm(emptyForm)
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const body = {
            ...form,
            price: Number(form.price),
            bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
            bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        }

        const url = editingId ? `/api/properties/${editingId}` : '/api/properties'
        const method = editingId ? 'PUT' : 'POST'

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            alert('Could not save the listing. Check the fields or log in again.')
            return
        }

        const saved = await res.json()

        if (editingId) {
            setProperties(properties.map((p) => (p.id === editingId ? saved : p)))
        } else {
            setProperties([...properties, saved])
        }

        setEditingId(null)
        setForm(emptyForm)
    }

    return (
        <section className="section">
            <div className="container">
                <div className="admin__header">
                    <h1>Admin</h1>
                    <button onClick={handleLogout} className="btn btn--outline">Log out</button>
                </div>

                {editingId && <div className="modal__backdrop" onClick={handleCancel}></div>}
                <div className={editingId ? 'admin__card admin__card--modal' : 'admin__card'}>
                    <h2>{editingId ? 'Edit listing' : 'Add listing'}</h2>
                    <form onSubmit={handleSubmit} className="contact__form">
                        <div className="field field--wide">
                            <label htmlFor="title">Title</label>
                            <input id="title" name="title" value={form.title} onChange={handleChange} required />
                        </div>
                        <div className="field field--wide">
                            <label htmlFor="type">Type</label>
                            <select id="type" name="type" value={form.type} onChange={handleChange}>
                                <option value="sale">For sale</option>
                                <option value="rent">For rent</option>
                            </select>
                        </div>
                        <div className="field field--wide">
                            <label htmlFor="price">Price (₱)</label>
                            <input id="price" type="number" name="price" value={form.price} onChange={handleChange} required />
                        </div>
                        <div className="field field--wide">
                            <label htmlFor="location">Location</label>
                            <input id="location" name="location" value={form.location} onChange={handleChange} required />
                        </div>
                        <div className="field field--wide">
                            <label htmlFor="bedrooms">Bedrooms</label>
                            <input id="bedrooms" type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} />
                        </div>
                        <div className="field field--wide">
                            <label htmlFor="bathrooms">Bathrooms</label>
                            <input id="bathrooms" type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} />
                        </div>
                        <div className="field field--wide">
                            <label htmlFor="lotArea">Lot area</label>
                            <input id="lotArea" name="lotArea" value={form.lotArea} onChange={handleChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="floorArea">Floor area</label>
                            <input id="floorArea" name="floorArea" value={form.floorArea} onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn btn--primary">
                            {editingId ? 'Save changes' : 'Add listing'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancel} className="btn btn--outline">
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                <h2>Listings</h2>
                <ul className="admin__list">
                    {properties.map((p) => (
                        <li key={p.id} className="admin__row">
                            <div>
                                <strong>{p.title}</strong>
                                <span className="admin__meta">
                                    {p.type} · ₱{p.price.toLocaleString()}
                                </span>
                            </div>
                            <div className="admin__actions">
                                <button onClick={() => handleEdit(p)} className="btn btn--outline">Edit</button>
                                <button onClick={() => handleDelete(p.id)} className="btn btn--outline">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
  }

  export default Admin