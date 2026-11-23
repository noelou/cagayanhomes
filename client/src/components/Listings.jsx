import { useState, useEffect } from 'react'
import PropertyCard from './PropertyCard.jsx'
import Pagination from './Pagination.jsx'
import Dropdown from './Dropdown.jsx'
import { getCachedList, fetchList } from '../data/propertyCache.js'
import './Listings.css'

const PAGE_SIZE = 9

// "Up to" = that price or lower. Edit these lists to change the budget choices.
const BUDGETS = {
    sale: [
        { label: 'Up to ₱500K', max: 500000 },
        { label: 'Up to ₱1M', max: 1000000 },
        { label: 'Up to ₱2M', max: 2000000 },
        { label: 'Above ₱2M', min: 2000000 },
    ],
    rent: [
        { label: 'Up to ₱10K', max: 10000 },
        { label: 'Up to ₱20K', max: 20000 },
        { label: 'Up to ₱30K', max: 30000 },
        { label: 'Up to ₱50K', max: 50000 },
        { label: 'Above ₱50K', min: 50000 },
    ],
}

const normalize = (s) => s.trim().toLowerCase()

function Listings({ type, title, subtitle }) {
    const [properties, setProperties] = useState(() => getCachedList() ?? [])
    const [page, setPage] = useState(1)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(() => getCachedList() === null)
    const [budget, setBudget] = useState('any')
    const [location, setLocation] = useState('all')

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

    const ofThisType = properties.filter((p) => p.type === type)

    // Locations come from the listings themselves (same place written in different
    // upper/lower case counts once), so every choice returns at least one property.
    const locationMap = new Map()
    for (const p of ofThisType) {
        const key = normalize(p.location)
        if (!locationMap.has(key)) locationMap.set(key, p.location.trim())
    }
    const locations = [...locationMap.entries()].sort((a, b) => a[1].localeCompare(b[1]))

    const budgetOptions = BUDGETS[type] ?? []
    const activeBudget = budget === 'any' ? null : budgetOptions[Number(budget)]
    const activeLocation = locationMap.has(location) ? location : 'all'

    const budgetChoices = [
        { value: 'any', label: 'Any budget' },
        ...budgetOptions.map((o, i) => ({ value: String(i), label: o.label })),
    ]
    const locationChoices = [
        { value: 'all', label: 'All locations' },
        ...locations.map(([key, label]) => ({ value: key, label })),
    ]

    const filtered = ofThisType.filter((p) => {
        if (activeBudget) {
            if (activeBudget.min !== undefined && !(p.price > activeBudget.min)) return false
            if (activeBudget.max !== undefined && !(p.price <= activeBudget.max)) return false
        }
        if (activeLocation !== 'all' && normalize(p.location) !== activeLocation) return false
        return true
    })

    const isFiltering = activeBudget !== null || activeLocation !== 'all'
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    function changePage(n) {
        setPage(n)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function changeBudget(value) {
        setBudget(value)
        setPage(1)
    }

    function changeLocation(value) {
        setLocation(value)
        setPage(1)
    }

    function clearFilters() {
        setBudget('any')
        setLocation('all')
        setPage(1)
    }

    return (
        <section className="section">
            <div className="container">
                <div className="section-heading">
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>

                {ofThisType.length > 0 && (
                    <div className="filters">
                        <div className="filters__field">
                            <label htmlFor="filter-budget">Budget</label>
                            <Dropdown id="filter-budget" value={budget} options={budgetChoices} onChange={changeBudget} />
                        </div>
                        <div className="filters__field filters__field--wide">
                            <label htmlFor="filter-location">Location</label>
                            <Dropdown id="filter-location" value={activeLocation} options={locationChoices} onChange={changeLocation} />
                        </div>
                        {isFiltering && (
                            <button type="button" className="btn btn--outline" onClick={clearFilters}>
                                Clear filters
                            </button>
                        )}
                        <span className="filters__count">
                            {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
                        </span>
                    </div>
                )}

                {loading && <p>Loading properties...</p>}
                {error && <p>Sorry, we couldn't load the properties right now. Please try again in a moment.</p>}
                {!loading && !error && ofThisType.length === 0 && <p>No properties available at the moment.</p>}
                {!loading && !error && ofThisType.length > 0 && filtered.length === 0 && (
                    <p>No properties match your filters. Try a different budget or location.</p>
                )}
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
