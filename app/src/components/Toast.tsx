import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from './Icon'

type ToastKind = 'success' | 'error'
type ToastAction = { label: string; onSelect: () => void }
type ToastOptions = { kind?: ToastKind; action?: ToastAction }
type ToastItem = { id: number; message: string; kind: ToastKind; action?: ToastAction }

const ToastContext = createContext<(message: string, options?: ToastOptions) => void>(() => {})

export function useToast() {
  return useContext(ToastContext)
}

const SHOW_MS = 2000
const FADE_MS = 250

/** One toast at a time. More messages wait in a line. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const show = useCallback((message: string, options: ToastOptions = {}) => {
    setQueue((q) => [...q, { id: nextId.current++, message, kind: options.kind ?? 'success', action: options.action }])
  }, [])

  const current = queue[0]
  const dismiss = useCallback(() => setQueue((q) => q.slice(1)), [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      {current ? <ToastView key={current.id} item={current} onDismiss={dismiss} /> : null}
    </ToastContext.Provider>
  )
}

function ToastView({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [paused, setPaused] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const isError = item.kind === 'error'

  // A success toast leaves after 5 seconds. An error toast stays until it is closed.
  useEffect(() => {
    if (paused || isError || leaving) return
    const timer = window.setTimeout(() => setLeaving(true), SHOW_MS)
    return () => window.clearTimeout(timer)
  }, [paused, isError, leaving])

  // The toast fades out first, then it is removed.
  useEffect(() => {
    if (!leaving) return
    const timer = window.setTimeout(onDismiss, FADE_MS)
    return () => window.clearTimeout(timer)
  }, [leaving, onDismiss])

  const leave = () => setLeaving(true)

  return (
    <div className="toast-wrap">
      <div
        className={`toast ${leaving ? 'toast-leaving' : ''}`.trim()}
        role={isError ? 'alert' : 'status'}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <span className={`toast-icon toast-icon-${item.kind}`}>
          <Icon name={isError ? 'alert' : 'check'} />
        </span>
        <span className="toast-message">{item.message}</span>
        {item.action ? (
          <button
            type="button"
            className="toast-action"
            onClick={() => {
              item.action?.onSelect()
              leave()
            }}
          >
            {item.action.label}
          </button>
        ) : null}
        <button type="button" className="toast-close" aria-label="Close message" onClick={leave}>
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  )
}
