import { Fragment, useEffect, useId, useRef, useState } from 'react'
import type { ReviewStatus } from '../lib/types'
import { StatusBadge } from './Badge'
import { Icon } from './Icon'

export type CaseOption = {
  id: string
  label: string
  status: ReviewStatus
  section?: string
  short?: string
}

type Props = {
  label: string
  items: CaseOption[]
  selectedId: string
  onSelect: (id: string) => void
  panelId: string
}

/** A dropdown to pick which case to look at. Each option shows its status. */
export function CaseSelect({ label, items, selectedId, onSelect, panelId }: Props) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = items.find((i) => i.id === selectedId) ?? items[0]

  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const nodes = [...(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])]
        const at = nodes.indexOf(document.activeElement as HTMLElement)
        const next = e.key === 'ArrowDown' ? (at + 1) % nodes.length : (at - 1 + nodes.length) % nodes.length
        nodes[next]?.focus()
      }
    }
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node
      if (listRef.current?.contains(t) || triggerRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [open])

  return (
    <div className="case-select">
      <button
        ref={triggerRef}
        type="button"
        className="case-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${current.label}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="case-select-name">{current.label}</span>
        <StatusBadge status={current.status} />
        <Icon name="chevronDown" size={16} />
      </button>

      {open ? (
        <div ref={listRef} id={listId} className="case-select-list" role="listbox" aria-label={label}>
          {items.map((item, index) => {
            const selected = item.id === selectedId
            const newSection = item.section && item.section !== items[index - 1]?.section
            return (
              <Fragment key={item.id}>
                {newSection ? <p className="case-select-section">{item.section}</p> : null}
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-controls={panelId}
                  className="case-select-option"
                  onClick={() => {
                    setOpen(false)
                    triggerRef.current?.focus()
                    onSelect(item.id)
                  }}
                >
                  <span className="case-select-check">{selected ? <Icon name="check" size={16} /> : null}</span>
                  <span className="case-select-name">{item.short ?? item.label}</span>
                  <StatusBadge status={item.status} />
                </button>
              </Fragment>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
