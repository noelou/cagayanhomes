import { useState, useRef, useEffect } from 'react'
import './Dropdown.css'

// A dropdown whose open list has a fixed width and wraps long options.
// options: [{ value, label }]   value: the selected option's value (a string)
function Dropdown({ id, value, options, onChange }) {
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(0)
    const rootRef = useRef(null)

    const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value))
    const selected = options[selectedIndex]

    // close when clicking anywhere outside
    useEffect(() => {
        if (!open) return
        function handleClick(e) {
            if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [open])

    function openList() {
        setActive(selectedIndex)
        setOpen(true)
    }

    function choose(index) {
        onChange(options[index].value)
        setOpen(false)
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            setOpen(false)
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (!open) openList()
            else setActive((a) => Math.min(a + 1, options.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (!open) openList()
            else setActive((a) => Math.max(a - 1, 0))
        } else if (e.key === 'Home' && open) {
            e.preventDefault()
            setActive(0)
        } else if (e.key === 'End' && open) {
            e.preventDefault()
            setActive(options.length - 1)
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (open) choose(active)
            else openList()
        } else if (e.key === 'Tab') {
            setOpen(false)
        }
    }

    return (
        <div className="dropdown" ref={rootRef}>
            <button
                type="button"
                id={id}
                className="dropdown__button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={`${id}-list`}
                title={selected?.label}
                onClick={() => (open ? setOpen(false) : openList())}
                onKeyDown={handleKeyDown}
            >
                <span className="dropdown__value">{selected?.label}</span>
            </button>

            {open && (
                <ul
                    id={`${id}-list`}
                    className="dropdown__list"
                    role="listbox"
                    aria-activedescendant={`${id}-option-${active}`}
                >
                    {options.map((o, i) => (
                        <li
                            key={o.value}
                            id={`${id}-option-${i}`}
                            role="option"
                            aria-selected={o.value === value}
                            className={
                                'dropdown__option' +
                                (i === active ? ' dropdown__option--active' : '') +
                                (o.value === value ? ' dropdown__option--selected' : '')
                            }
                            onMouseEnter={() => setActive(i)}
                            onClick={() => choose(i)}
                        >
                            {o.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Dropdown
