import { useState } from 'react'
import { useOutletContext } from 'react-router'
import Pagination from '../components/Pagination.jsx'
import './AdminLayout.css'

const MSG_PAGE_SIZE = 5

function AdminMessages() {
    const { inquiries, setInquiries } = useOutletContext()
    const [msgPage, setMsgPage] = useState(1)

    async function handleToggleRead(inq) {
        const res = await fetch(`/api/admin/inquiries/${inq.id}/read`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ isRead: !inq.isRead }),
        })
        if (!res.ok) {
            alert('Could not update the message.')
            return
        }
        setInquiries(inquiries.map((i) => (i.id === inq.id ? { ...i, isRead: !inq.isRead } : i)))
    }

    async function handleDeleteInquiry(id) {
        if (!confirm('Delete this message? This cannot be undone.')) return
        const res = await fetch(`/api/admin/inquiries/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        if (!res.ok) {
            alert('Could not delete the message.')
            return
        }
        setInquiries(inquiries.filter((i) => i.id !== id))
    }

    const unread = inquiries.filter((i) => !i.isRead).length
    const totalPages = Math.max(1, Math.ceil(inquiries.length / MSG_PAGE_SIZE))
    const currentPage = Math.min(msgPage, totalPages)
    const visible = inquiries.slice((currentPage - 1) * MSG_PAGE_SIZE, currentPage * MSG_PAGE_SIZE)

    return (
        <div>
            <div className="admin__bar">
                <h2>Messages{unread > 0 && ` (${unread} new)`}</h2>
            </div>

            {inquiries.length === 0 && <p className="admin__empty">No messages yet.</p>}

            <ul className="admin__list">
                {visible.map((i) => (
                    <li key={i.id} className="admin__row admin__row--top">
                        <div>
                            <strong>{!i.isRead && '● '}{i.name}</strong>
                            <span className="admin__meta">
                                <a href={`mailto:${i.email}`}>{i.email}</a>
                                {i.phone && <> · <a href={`tel:${i.phone}`}>{i.phone}</a></>}
                                {' · '}{new Date(i.createdAt).toLocaleString()}
                                {i.propertyTitle && <> · re: {i.propertyTitle}</>}
                            </span>
                            <p className="admin__message">{i.message}</p>
                        </div>
                        <div className="admin__actions">
                            <button onClick={() => handleToggleRead(i)} className="btn btn--outline">
                                {i.isRead ? 'Mark unread' : 'Mark read'}
                            </button>
                            <button onClick={() => handleDeleteInquiry(i.id)} className="btn btn--outline">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            <Pagination page={currentPage} totalPages={totalPages} onChange={setMsgPage} />
        </div>
    )
}

export default AdminMessages
