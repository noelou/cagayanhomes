import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Pagination from '../components/Pagination.jsx'
import { clearPropertyCache } from '../data/propertyCache.js'
import './AdminLayout.css'

const LIST_PAGE_SIZE = 8

 const emptyForm = {
    title: '', type: 'sale', price: '', location: '',
    bedrooms: '', bathrooms: '', lotArea: '', floorArea: '',  sellerPhone: '', coords: '',
}

// Reads "8.4542, 124.6319" (as copied from Google Maps) into two numbers.
// Returns null if the text is not valid coordinates.
function parseCoords(text) {
    const match = text.trim().match(/^(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)$/)
    if (!match) return null
    const latitude = Number(match[1])
    const longitude = Number(match[2])
    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null
    return { latitude, longitude }
}

function AdminListings() {
    const navigate = useNavigate()
    const [properties, setProperties] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [files, setFiles] = useState([])
    const [fileKey, setFileKey] = useState(0)
    const [typeFilter, setTypeFilter] = useState('all')
    const [listPage, setListPage] = useState(1)

    useEffect(() => {
        async function loadProperties() {
            const res = await fetch('/api/admin/properties', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })

            if (!res.ok) {
                navigate('/admin/login')
                return
            }

            const data = await res.json()
            setProperties(data)
        }
        loadProperties()
    }, [])

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

        clearPropertyCache()
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
            sellerPhone: p.sellerPhone ?? '',
            coords: p.latitude != null && p.longitude != null ? `${p.latitude}, ${p.longitude}` : '',
        })
        setShowForm(true)
    }

    function handleCancel() {
        setEditingId(null)
        setForm(emptyForm)
        setShowForm(false)
    }

    function handleAdd() {
        setEditingId(null)
        setForm(emptyForm)
        setShowForm(true)
    }

    function replaceProperty(updated) {
      clearPropertyCache()
      setProperties(properties.map((p) => (p.id === updated.id ? updated : p)))
    }

    async function handleRemovePhoto(url) {
        if (!confirm('Remove this photo?')) return

        const res = await fetch(
            `/api/properties/${editingId}/photos?url=${encodeURIComponent(url)}`,
            {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
        )

        if (!res.ok) {
            alert('Could not remove the photo.')
            return
        }

        replaceProperty(await res.json())
    }

    async function handleMakeCover(url) {
        const res = await fetch(`/api/properties/${editingId}/cover`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ url }),
        })

        if (!res.ok) {
            alert('Could not change the cover photo.')
            return
        }

        replaceProperty(await res.json())
    }

    async function handleSubmit(e) {
        e.preventDefault()

        let coordinates = { latitude: null, longitude: null }
        if (form.coords.trim()) {
            coordinates = parseCoords(form.coords)
            if (!coordinates) {
                alert('Map coordinates should look like: 8.4542, 124.6319 (latitude, longitude).')
                return
            }
        }

        const body = {
            ...form,
            ...coordinates,
            price: Number(form.price),
            bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
            bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
            sellerPhone: form.sellerPhone || null,
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

        let saved = await res.json()

        if (files.length > 0) {
            const data = new FormData()
            for (const f of files) {
                data.append('photos', f)
            }

            const photoRes = await fetch(`/api/properties/${saved.id}/photos`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: data,
            })

            if (photoRes.ok) {
                saved = await photoRes.json()
            } else {
                alert('Listing saved, but the photos could not be uploaded.')
            }
        }

        clearPropertyCache()

        if (editingId) {
            setProperties(properties.map((p) => (p.id === editingId ? saved : p)))
        } else {
            setProperties([...properties, saved])
        }

        setEditingId(null)
        setForm(emptyForm)

        setFiles([])
        setShowForm(false)
        setFileKey(fileKey + 1)
    }

    const editing = properties.find((p) => p.id === editingId)

    const filteredProperties = typeFilter === 'all'
        ? properties
        : properties.filter((p) => p.type === typeFilter)
    const listTotalPages = Math.max(1, Math.ceil(filteredProperties.length / LIST_PAGE_SIZE))
    const currentListPage = Math.min(listPage, listTotalPages)
    const visibleProperties = filteredProperties.slice(
        (currentListPage - 1) * LIST_PAGE_SIZE,
        currentListPage * LIST_PAGE_SIZE
    )

    function changeFilter(value) {
        setTypeFilter(value)
        setListPage(1)
    }

    return (
        <div>
                {showForm && (
                <>
                    <div className="modal__backdrop" onClick={handleCancel}></div>
                    <div className="admin__card admin__card--modal">
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
                                <input id="location" name="location" list="location-options" value={form.location} onChange={handleChange} required />
                                <datalist id="location-options">
                                    {[...new Set(properties.map((p) => p.location.trim()))].sort().map((loc) => (
                                        <option key={loc} value={loc} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="field field--wide">
                                <label htmlFor="coords">Map coordinates (optional)</label>
                                <input id="coords" name="coords" placeholder="8.4542, 124.6319" value={form.coords} onChange={handleChange} />
                                <small className="admin__meta">
                                    In Google Maps, right-click the exact spot and click the numbers at the top of the menu to copy them, then paste here. Leave empty to search the map by the location text.
                                </small>
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
                            <div className="field field--wide">
                                <label htmlFor="sellerPhone">Seller number (private)</label>
                                <input id="sellerPhone" name="sellerPhone" value={form.sellerPhone} onChange={handleChange} />
                            </div>
                            {editing && editing.images?.length > 0 && (
                                <div className="field--wide photo-grid">
                                    {editing.images.map((url) => (
                                        <div key={url} className="photo-grid__item">
                                            <img src={url} alt="" />
                                            {url === editing.thumbnail ? (
                                                <span className="photo-grid__cover">Cover</span>
                                            ) : (
                                                <button type="button" onClick={() => handleMakeCover(url)}>Make cover</button>
                                            )}
                                            <button type="button" className="photo-grid__remove" onClick={() => handleRemovePhoto(url)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="field field--wide">
                                <label htmlFor="photos">Photos</label>
                                <input
                                    key={fileKey}
                                    id="photos"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => setFiles([...e.target.files])}
                                />
                            </div>
                            <div className="admin__buttons">
                                <button type="submit" className="btn btn--primary">
                                    {editingId ? 'Save changes' : 'Add listing'}
                                </button>
                                <button type="button" onClick={handleCancel} className="btn btn--outline">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </>
                )}

                <div className="admin__bar">
                    <h2>Listings</h2>
                    <button onClick={handleAdd} className="btn btn--primary">+ Add listing</button>
                </div>
                <div className="admin__filters">
                    {[['all', 'All'], ['sale', 'For sale'], ['rent', 'For rent']].map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => changeFilter(value)}
                            className={typeFilter === value ? 'btn btn--primary' : 'btn btn--outline'}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                {filteredProperties.length === 0 && <p className="admin__empty">No listings found.</p>}
                <ul className="admin__list">
                    {visibleProperties.map((p) => (
                        <li key={p.id} className="admin__row">
                            <div className="admin__info">
                                {p.thumbnail && <img src={p.thumbnail} alt="" className="admin__thumb" />}
                                <div>
                                    <strong>{p.title}</strong>
                                    <span className="admin__meta">
                                        {p.type} · ₱{p.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="admin__actions">
                                <button onClick={() => handleEdit(p)} className="btn btn--outline">Edit</button>
                                <button onClick={() => handleDelete(p.id)} className="btn btn--outline">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <Pagination page={currentListPage} totalPages={listTotalPages} onChange={setListPage} />
        </div>
    )
}

export default AdminListings
