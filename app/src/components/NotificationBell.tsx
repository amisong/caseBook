import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Role } from '../lib/types'
import { useApp } from '../lib/store'
import { PEOPLE } from '../lib/data'
import { formatRelative } from '../lib/time'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { IconButton } from './IconButton'

/** Notifications come from the other person. */
function sender(role: Role): string {
  return PEOPLE[role === 'designer' ? 'developer' : 'designer'].name
}

/** Bell in the header. A dot shows when something is unread. Opens a list of notifications. */
export function NotificationBell() {
  const { state, dispatch } = useApp()
  const notices = state.notices.filter((n) => n.role === state.role)
  const unreadCount = notices.filter((n) => !n.read).length
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const panelId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Focus moves into the panel when it opens. Escape or a click outside closes it.
  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [open])

  const label = unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'

  return (
    <div className="bell">
      <IconButton
        ref={triggerRef}
        icon="bell"
        label={label}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
      />
      {unreadCount > 0 ? <span className="bell-dot" aria-hidden="true" /> : null}

      {open ? (
        <div ref={panelRef} id={panelId} className="notice-panel" role="region" aria-label="Notifications">
          <div className="notice-head">
            <h2 className="notice-title">Notifications</h2>
            {unreadCount > 0 ? (
              <Button variant="ghost" size="small" onClick={() => dispatch({ type: 'markAllRead', role: state.role })}>
                Mark all as read
              </Button>
            ) : null}
          </div>

          {notices.length === 0 ? (
            <p className="notice-empty">No notifications yet.</p>
          ) : (
            <ul className="notice-list">
              {notices.map((notice) => (
                <li key={notice.id}>
                  <button
                    type="button"
                    className={`notice ${notice.read ? '' : 'notice-unread'}`.trim()}
                    onClick={() => {
                      dispatch({ type: 'markNoticeRead', id: notice.id })
                      setOpen(false)
                      navigate(notice.to)
                    }}
                  >
                    <span className="notice-photo">
                      <span className="notice-avatar" aria-hidden="true">
                        <Avatar role={notice.role === 'designer' ? 'developer' : 'designer'} />
                      </span>
                      <span className="notice-mark" aria-hidden="true" />
                    </span>
                    <span className="notice-head-text">
                      <span className="notice-name">{sender(notice.role)}</span>
                      <span className="notice-time">{formatRelative(notice.createdAt)}</span>
                    </span>
                    <span className="notice-message">
                      {notice.read ? '' : <span className="visually-hidden">Unread. </span>}
                      {notice.message}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
