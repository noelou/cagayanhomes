import { useNavigate } from 'react-router'

function Admin() {
    const navigate = useNavigate()

    function handleLogout() {
        localStorage.removeItem('token')
        navigate('/admin/login')
    }

    return (
        <section className="section">
            <div className="container">
                <h1>Admin</h1>
                <p>You are logged in.</p>
                <button onClick={handleLogout} className="btn btn--primary">Log out</button>
            </div>
        </section>
    )
}

export default Admin