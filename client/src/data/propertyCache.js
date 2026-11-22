// In-memory cache for public property data.
// Pages show the cached copy instantly, then refresh it quietly from the server.

let list = null
const byId = new Map()

export function getCachedList() {
    return list
}

export function getCachedProperty(id) {
    return byId.get(id) ?? null
}

export async function fetchList() {
    const res = await fetch('/api/properties')
    if (!res.ok) throw new Error('Request failed')
    list = await res.json()
    byId.clear()
    for (const p of list) byId.set(p.id, p)
    return list
}

// Returns the property, or null if it does not exist (404).
export async function fetchProperty(id) {
    const res = await fetch(`/api/properties/${id}`)
    if (res.status === 404) {
        byId.delete(id)
        return null
    }
    if (!res.ok) throw new Error('Request failed')
    const data = await res.json()
    byId.set(id, data)
    return data
}

// Call after the admin adds, edits or deletes something.
export function clearPropertyCache() {
    list = null
    byId.clear()
}
