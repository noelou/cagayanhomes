import './Pagination.css'

function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null

    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                type="button"
                className="btn btn--outline"
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
            >
                ← Previous
            </button>
            <span className="pagination__info">Page {page} of {totalPages}</span>
            <button
                type="button"
                className="btn btn--outline"
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages}
            >
                Next →
            </button>
        </nav>
    )
}

export default Pagination
