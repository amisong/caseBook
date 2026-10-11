import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  /** The button that opened it. Clicks on it do not count as "outside". Focus returns to it. */
  triggerRef: RefObject<HTMLElement>
  label: string
  /** Wider panels are allowed. Default is the popup width. */
  width?: number
  children: ReactNode
}

/**
 * A small panel under its trigger (design system 4.13).
 * Escape or a click outside closes it. Focus moves in on open and back on close.
 */
export function Popover({ open, onClose, triggerRef, label, width, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const node = ref.current
    node?.querySelector<HTMLElement>('button, input, textarea, a[href]')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        triggerRef.current?.focus()
      }
    }
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node
      if (node?.contains(target) || triggerRef.current?.contains(target)) return
      onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [open, onClose, triggerRef])

  if (!open) return null
  return (
    <div
      ref={ref}
      id={id}
      className="popover"
      role="dialog"
      aria-label={label}
      style={width ? { width: `min(${width}px, calc(100vw - 32px))` } : undefined}
    >
      {children}
    </div>
  )
}
