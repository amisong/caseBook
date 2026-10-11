import { useEffect, useId, useRef, useState } from 'react'
import { PEOPLE } from '../lib/data'
import { useApp } from '../lib/store'
import type { Role } from '../lib/types'
import { Avatar } from './Avatar'
import { Icon } from './Icon'

const ROLES: Role[] = ['designer', 'developer']

/** Bottom of the left sidebar. Shows who the demo is acting as. Opens a small popup to switch person or reset the demo. */
export function DemoMenu() {
  const { state, dispatch } = useApp()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector<HTMLElement>('[role="menuitemradio"][aria-checked="true"]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t) || triggerRef.current?.contains(t)) return
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
    <div className="demo-menu">
      <button
        ref={triggerRef}
        type="button"
        className="demo-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="demo-face">
          <Avatar role={state.role} />
        </span>
        <span className="demo-name">{PEOPLE[state.role].name}</span>
      </button>

      {open ? (
        <div ref={menuRef} id={menuId} className="demo-popup" role="menu" aria-label="Demo view">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              role="menuitemradio"
              aria-checked={state.role === role}
              className="demo-option"
              onClick={() => {
                dispatch({ type: 'setRole', role })
                setOpen(false)
              }}
            >
              <span className="demo-face">
                <Avatar role={role} />
              </span>
              <span className="demo-option-text">
                <span>{PEOPLE[role].name}</span>
                <span className="demo-option-role">{role === 'designer' ? 'Designer' : 'Developer'}</span>
              </span>
              {state.role === role ? <Icon name="check" size={16} /> : null}
            </button>
          ))}
          <div className="demo-divider" role="separator" />
          <button
            type="button"
            role="menuitem"
            className="demo-option"
            onClick={() => {
              dispatch({ type: 'reset' })
              window.location.assign('/')
            }}
          >
            Reset demo
          </button>
        </div>
      ) : null}
    </div>
  )
}
