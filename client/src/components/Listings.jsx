import { useState, useEffect } from 'react'
import PropertyCard from './PropertyCard.jsx'
import Pagination from './Pagination.jsx'
import { getCachedList, fetchList } from '../data/propertyCache.js'

const PAGE_SIZE = 9

function Listings({ type, title, subtitle }) {
    const [properties, setProperties] = useState(() => getCachedList() ?? [])
    const [page, setPage] = useState(1)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(() => getCachedList() === null)

    useEffect(() => {
        async function loadProperties() {
            try {
                setProperties(await fetchList())
                setError(false)
            } catch {
                // keep showing cached properties if we have them
                if (getCachedList() === null) setError(true)
            }
            setLoading(false)
        }
        loadProperties()
    }, [])
    
    const filtered = properties.filter((p) => p.type === type)
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    function changePage(n) {
        setPage(n)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <section className="section">
            <div className="container">
                <div className="section-heading">
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>

                {loading && <p>Loading properties...</p>}
                {error && <p>Sorry, we couldn't load the properties right now. Please try again in a moment.</p>}
                {!loading && !error && filtered.length === 0 && <p>No properties available at the moment.</p>}
                <div className="grid grid--3">
                    {visible.map((p) => (
                        <PropertyCard key={p.id} {...p} />
                    ))}
                </div>
                <Pagination page={currentPage} totalPages={totalPages} onChange={changePage} />
            </div>
        </section>
    )
}

export default Listings