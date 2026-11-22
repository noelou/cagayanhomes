import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useContent } from '../components/ContentProvider.jsx'
import './AdminLayout.css'

function Input({ label, value, onChange, rows }) {
    return (
        <div className="field">
            <label>{label}</label>
            {rows ? (
                <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
            ) : (
                <input value={value} onChange={(e) => onChange(e.target.value)} />
            )}
        </div>
    )
}

function Section({ title, hint, status, onSave, children }) {
    return (
        <form
            className="admin__card content-section"
            onSubmit={(e) => {
                e.preventDefault()
                onSave()
            }}
        >
            <h2>{title}</h2>
            {hint && <p className="admin__meta">{hint}</p>}
            <div className="content-section__fields">{children}</div>
            <div className="admin__buttons">
                <button type="submit" className="btn btn--primary" disabled={status === 'saving'}>
                    {status === 'saving' ? 'Saving…' : 'Save'}
                </button>
                {status === 'saved' && <span className="content-section__ok">✓ Saved</span>}
                {status && status !== 'saving' && status !== 'saved' && (
                    <span className="content-section__err">{status}</span>
                )}
            </div>
        </form>
    )
}

function ContentForm({ initial, setSection }) {
    const navigate = useNavigate()
    const [draft, setDraft] = useState(() => structuredClone(initial))
    const [status, setStatus] = useState({})

    function setField(key, field, value) {
        setDraft((d) => ({ ...d, [key]: { ...d[key], [field]: value } }))
    }

    function setListItem(key, listField, index, field, value) {
        setDraft((d) => {
            const section = d[key]
            const items = listField ? section[listField] : section
            const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
            return { ...d, [key]: listField ? { ...section, [listField]: next } : next }
        })
    }

    async function save(key) {
        setStatus((s) => ({ ...s, [key]: 'saving' }))

        const res = await fetch(`/api/admin/content/${key}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ value: draft[key] }),
        })

        if (res.status === 401) {
            navigate('/admin/login')
            return
        }

        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            setStatus((s) => ({ ...s, [key]: data.message || 'Could not save.' }))
            return
        }

        const saved = await res.json()
        setSection(key, saved)
        setDraft((d) => ({ ...d, [key]: saved }))
        setStatus((s) => ({ ...s, [key]: 'saved' }))
    }

    function addTestimonial() {
        setDraft((d) => ({
            ...d,
            testimonials: [...d.testimonials, { name: '', detail: '', quote: '' }],
        }))
    }

    function removeTestimonial(index) {
        if (!confirm('Remove this testimonial? (Click Save afterwards to apply.)')) return
        setDraft((d) => ({ ...d, testimonials: d.testimonials.filter((_, i) => i !== index) }))
    }

    return (
        <div>
            <div className="admin__bar">
                <h2>Site content</h2>
            </div>
            <p className="admin__meta content-intro">
                Edit the wording shown on the website. Each box has its own Save button.
            </p>

            <Section
                title="Contact details"
                hint="Shown on the Contact page, the footer and the About page."
                status={status.agent}
                onSave={() => save('agent')}
            >
                <Input label="Name" value={draft.agent.name} onChange={(v) => setField('agent', 'name', v)} />
                <Input label="Phone" value={draft.agent.phoneDisplay} onChange={(v) => setField('agent', 'phoneDisplay', v)} />
                <Input label="Email" value={draft.agent.email} onChange={(v) => setField('agent', 'email', v)} />
                <Input label="Location" value={draft.agent.location} onChange={(v) => setField('agent', 'location', v)} />
            </Section>

            <Section
                title="Home page: top banner"
                status={status.hero}
                onSave={() => save('hero')}
            >
                <Input label="Headline" value={draft.hero.title} onChange={(v) => setField('hero', 'title', v)} />
                <Input label="Text under the headline" rows={4} value={draft.hero.text} onChange={(v) => setField('hero', 'text', v)} />
                <Input label={'"I\'m Selling" button link (e.g. a Google Drive link)'} value={draft.hero.sellingLink} onChange={(v) => setField('hero', 'sellingLink', v)} />
                <p className="admin__meta">The "I'm Selling" button always shows. Until a link is saved here, clicking it does nothing. The link opens in a new tab.</p>
            </Section>

            <Section
                title="Home page: Why work with me"
                status={status.why}
                onSave={() => save('why')}
            >
                <Input label="Heading" value={draft.why.title} onChange={(v) => setField('why', 'title', v)} />
                <Input label="Text under the heading" rows={3} value={draft.why.text} onChange={(v) => setField('why', 'text', v)} />
                {draft.why.reasons.map((r, i) => (
                    <div key={i} className="content-item">
                        <Input label={`Card ${i + 1} title`} value={r.title} onChange={(v) => setListItem('why', 'reasons', i, 'title', v)} />
                        <Input label={`Card ${i + 1} text`} rows={2} value={r.text} onChange={(v) => setListItem('why', 'reasons', i, 'text', v)} />
                    </div>
                ))}
            </Section>

            <Section
                title="About Me page"
                hint="Leave an empty line between paragraphs."
                status={status.about}
                onSave={() => save('about')}
            >
                <Input label="About text" rows={9} value={draft.about.text} onChange={(v) => setField('about', 'text', v)} />
            </Section>

            <Section title="Buy page" status={status.buy} onSave={() => save('buy')}>
                <Input label="Title" value={draft.buy.title} onChange={(v) => setField('buy', 'title', v)} />
                <Input label="Subtitle" value={draft.buy.subtitle} onChange={(v) => setField('buy', 'subtitle', v)} />
            </Section>

            <Section title="Rent page" status={status.rent} onSave={() => save('rent')}>
                <Input label="Title" value={draft.rent.title} onChange={(v) => setField('rent', 'title', v)} />
                <Input label="Subtitle" value={draft.rent.subtitle} onChange={(v) => setField('rent', 'subtitle', v)} />
            </Section>

            <Section
                title="Client testimonials"
                hint="Shown on the Home, Buy, Rent, About and Contact pages. Up to 12."
                status={status.testimonials}
                onSave={() => save('testimonials')}
            >
                {draft.testimonials.map((t, i) => (
                    <div key={i} className="content-item">
                        <Input label="Name" value={t.name} onChange={(v) => setListItem('testimonials', null, i, 'name', v)} />
                        <Input label="Detail (optional)" value={t.detail} onChange={(v) => setListItem('testimonials', null, i, 'detail', v)} />
                        <Input label="Quote" rows={3} value={t.quote} onChange={(v) => setListItem('testimonials', null, i, 'quote', v)} />
                        <button type="button" className="btn btn--outline" onClick={() => removeTestimonial(i)}>
                            Remove
                        </button>
                    </div>
                ))}
                {draft.testimonials.length < 12 && (
                    <button type="button" className="btn btn--outline content-add" onClick={addTestimonial}>
                        + Add testimonial
                    </button>
                )}
            </Section>
        </div>
    )
}

function AdminContent() {
    const { content, loaded, setSection } = useContent()

    if (!loaded) return <p>Loading…</p>

    return <ContentForm initial={content} setSection={setSection} />
}

export default AdminContent
