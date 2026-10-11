import { useRef } from 'react'
import type { ReviewStatus } from '../lib/types'
import { StatusBadge } from './Badge'

export type TabItem = { id: string; label: string; status: ReviewStatus }

type Props = {
  label: string
  items: TabItem[]
  selectedId: string
  onSelect: (id: string) => void
  panelId: string
}

/** Case tabs. Each tab shows its status (design system 4.19). */
export function Tabs({ label, items, selectedId, onSelect, panelId }: Props) {
  const listRef = useRef<HTMLDivElement>(null)

  const onKeyDown = (e: React.KeyboardEvent) => {
    const index = items.findIndex((i) => i.id === selectedId)
    let next = -1
    if (e.key === 'ArrowRight') next = (index + 1) % items.length
    if (e.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = items.length - 1
    if (next < 0) return
    e.preventDefault()
    onSelect(items[next].id)
    window.requestAnimationFrame(() => listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus())
  }

  return (
    <div className="tabs" role="tablist" aria-label={label} ref={listRef} onKeyDown={onKeyDown}>
      {items.map((item) => {
        const selected = item.id === selectedId
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            className={`tab ${selected ? 'tab-on' : ''}`.trim()}
            onClick={() => onSelect(item.id)}
          >
            <span className="tab-label">{item.label}</span>
            <StatusBadge status={item.status} />
          </button>
        )
      })}
    </div>
  )
}
