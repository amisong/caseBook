import { useEffect, useRef, useState } from 'react'
import type { IconName } from './Icon'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

export type MenuItem = { label: string; icon?: IconName; danger?: boolean; onSelect: () => void }

type Props = { label: string; items: MenuItem[] }

/** A button that opens a short list of actions (design system 4.7). */
export function Menu({ label, items }: Props) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const open = pos !== null

  const close = () => {
    setPos(null)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const nodes = [...(listRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])]
        const at = nodes.indexOf(document.activeElement as HTMLElement)
        const next = e.key === 'ArrowDown' ? (at + 1) % nodes.length : (at - 1 + nodes.length) % nodes.length
        nodes[next]?.focus()
      }
    }
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node
      if (listRef.current?.contains(t) || triggerRef.current?.contains(t)) return
      setPos(null)
    }
    const onScroll = () => setPos(null)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
      window.removeEventListener('scroll', onScroll, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const toggle = () => {
    if (open) {
      setPos(null)
      return
    }
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
  }

  return (
    <>
      <IconButton ref={triggerRef} icon="dots" label={label} aria-haspopup="menu" aria-expanded={open} onClick={toggle} />
      {open ? (
        <div ref={listRef} className="menu" role="menu" style={{ top: pos.top, right: pos.right }}>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={`menu-item ${item.danger ? 'menu-item-danger' : ''}`.trim()}
              onClick={() => {
                setPos(null)
                item.onSelect()
              }}
            >
              {item.icon ? <Icon name={item.icon} size={16} /> : null}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </>
  )
}
