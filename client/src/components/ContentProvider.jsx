import { createContext, useContext, useState, useEffect } from 'react'
import { defaultContent } from '../data/defaults.js'

const ContentContext = createContext({
    content: defaultContent,
    loaded: false,
    setSection: () => {},
})

export function ContentProvider({ children }) {
    const [content, setContent] = useState(defaultContent)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/content')
                if (res.ok) {
                    const saved = await res.json()
                    // Merge section by section, so a newly added field keeps its default
                    // even if an older saved version of that section does not have it.
                    const merged = { ...defaultContent }
                    for (const key of Object.keys(saved)) {
                        const isObject = saved[key] && typeof saved[key] === 'object' && !Array.isArray(saved[key])
                        merged[key] = isObject ? { ...defaultContent[key], ...saved[key] } : saved[key]
                    }
                    setContent(merged)
                }
            } catch {
                // keep the defaults if the server can't be reached
            }
            setLoaded(true)
        }
        load()
    }, [])

    function setSection(key, value) {
        setContent((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <ContentContext.Provider value={{ content, loaded, setSection }}>
            {children}
        </ContentContext.Provider>
    )
}

export function useContent() {
    return useContext(ContentContext)
}
