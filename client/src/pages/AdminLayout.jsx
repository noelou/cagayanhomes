import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import './AdminLayout.css'

function AdminLayout() {
    const navigate = useNavigate()
    const [inquiries, setInquiries] = useState([])

    useEffect(() => {
        async function loadInquiries() {
            const res = await fetch('/api/admin/inquiries', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })

            if (!res.ok) {
                navigate('/admin/login')
                return
            }

            setInquiries(await res.json())
        }
        loadInquiries()
    }, [])

    function handleLogout() {
        localStorage.removeItem('token')
        navigate('/admin/login')
    }

    const unread = inquiries.filter((i) => !i.isRead).length

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar__title">Admin</div>
                <nav className="admin-sidebar__nav">
                    <NavLink to="/admin/listings">Listings</NavLink>
                    <NavLink to="/admin/messages">
                        Messages
                        {unread > 0 && <span className="admin-sidebar__badge">{unread}</span>}
                    </NavLink>
                    <NavLink to="/admin/content">Content</NavLink>
                </nav>
                <div className="admin-sidebar__footer">
                    <NavLink to="/" className="admin-sidebar__site">View site</NavLink>
                    <button onClick={handleLogout} className="btn btn--outline-light">Log out</button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet context={{ inquiries, setInquiries }} />
            </main>
        </div>
    )
}

export default AdminLayout
