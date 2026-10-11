import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { measureNote, readElement, sidesText, type InspectInfo } from '../lib/inspect'
import { useMediaQuery } from '../lib/useMediaQuery'
import type { CaseItem, Pin, Review } from '../lib/types'
import { pinStatusLabel, StatusBadge } from './Badge'
import { IconButton } from './IconButton'
import { Button } from './Button'
import { Icon } from './Icon'
import { PinMark } from './PinMark'
import { SampleScreen } from './SampleScreen'
import { TextArea } from './TextArea'

export type Location = { target: string; x: number; y: number }
/** A new comment starts at a place on the design. `text` is a first line, such as measurements. */
export type Draft = Location & { text?: string }
export type StageUi = { selectedPinId: string | null; editing: boolean; draft: Draft | null }

type Props = {
  review: Review
  caseItem: CaseItem
  pins: Pin[]
  /** The designer may add pins. */
  canPin: boolean
  /** The designer may edit and delete comments. */
  canEdit: boolean
  ui: StageUi
  setUi: (ui: StageUi) => void
  nextNumber: number
  onAddPin: (location: Location, text: string) => void
  onEditPin: (pin: Pin, text: string) => void
  onDeletePin: (pin: Pin) => void
  onMovePin: (pin: Pin, location: Location) => void
  panelId: string
  /** Inspect mode: hover shows size, text style and spacing. */
  inspect: boolean
  /** The preview fills the whole window. */
  fullscreen: boolean
  onToggleInspect: () => void
  onExitFullscreen: () => void
}

type Point = { left: number; top: number }

const POPUP_WIDTH = 300
const POPUP_HEIGHT = 230

/** The design for one case, with pins on top and the comment popup next to the selected pin. */
export function PreviewStage({
  review,
  caseItem,
  pins,
  canPin,
  canEdit,
  ui,
  setUi,
  nextNumber,
  onAddPin,
  onEditPin,
  onDeletePin,
  onMovePin,
  panelId,
  inspect,
  fullscreen,
  onToggleInspect,
  onExitFullscreen,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [positions, setPositions] = useState<Record<string, Point>>({})
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })
  const [drag, setDrag] = useState<{ id: string; point: Point } | null>(null)
  const dragInfo = useRef<{ startX: number; startY: number; origin: Point; moved: boolean } | null>(null)
  const justDragged = useRef(false)
  const isPhone = useMediaQuery('(max-width: 639px)')
  const [hover, setHover] = useState<{ el: Element; info: InspectInfo; rect: DOMRect } | null>(null)

  const group = review.groups.find((g) => g.id === caseItem.groupId)
  const visible = pins.filter((p) => !p.deleted).sort((a, b) => a.number - b.number)

  const toStage = useCallback((target: string, x: number, y: number): Point | null => {
    const stage = stageRef.current
    const frame = frameRef.current
    const el = frame?.querySelector<HTMLElement>(`[data-pin-target="${target}"]`) ?? frame?.querySelector<HTMLElement>('[data-pin-target="screen"]')
    if (!stage || !el) return null
    const s = stage.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    return { left: r.left - s.left + (r.width * x) / 100, top: r.top - s.top + (r.height * y) / 100 }
  }, [])

  // Keep the newest pins in a ref, so measuring does not depend on a new array each render.
  const latest = useRef({ visible, draft: ui.draft })
  latest.current = { visible, draft: ui.draft }

  const measure = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const { visible: pinsNow, draft } = latest.current
    const next: Record<string, Point> = {}
    for (const pin of pinsNow) {
      const p = toStage(pin.target, pin.x, pin.y)
      if (p) next[pin.id] = p
    }
    if (draft) {
      const p = toStage(draft.target, draft.x, draft.y)
      if (p) next.draft = p
    }
    setPositions((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    const width = stage.clientWidth
    const height = stage.clientHeight
    setStageSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
  }, [toStage])

  const signature =
    visible.map((p) => `${p.id}:${p.target}:${p.x}:${p.y}`).join('|') +
    (ui.draft ? `|draft:${ui.draft.target}:${ui.draft.x}:${ui.draft.y}` : '')

  useLayoutEffect(() => {
    measure()
  }, [measure, signature, review.revision, caseItem.id])

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => measure())
    observer.observe(stage)
    if (frameRef.current) observer.observe(frameRef.current)
    return () => observer.disconnect()
  }, [measure])

  /** Which element of the design is under this screen point, and where inside it. */
  const locate = (clientX: number, clientY: number): Location | null => {
    const frame = frameRef.current
    if (!frame) return null
    for (const el of document.elementsFromPoint(clientX, clientY)) {
      const target = (el as HTMLElement).closest<HTMLElement>('[data-pin-target]')
      if (target && frame.contains(target)) {
        const r = target.getBoundingClientRect()
        const clamp = (n: number) => Math.min(100, Math.max(0, n))
        return {
          target: target.dataset.pinTarget!,
          x: Math.round(clamp(((clientX - r.left) / r.width) * 100) * 10) / 10,
          y: Math.round(clamp(((clientY - r.top) / r.height) * 100) * 10) / 10,
        }
      }
    }
    return null
  }

  const onFrameClick = (e: React.MouseEvent) => {
    if (!canPin) {
      if (ui.selectedPinId) setUi({ selectedPinId: null, editing: false, draft: null })
      return
    }
    const loc = locate(e.clientX, e.clientY)
    if (!loc) return
    const text = inspect && hover ? measureNote(hover.info) : undefined
    setUi({ selectedPinId: null, editing: false, draft: text ? { ...loc, text } : loc })
  }

  const onFrameMove = (e: React.MouseEvent) => {
    if (!inspect) return
    const el = e.target as Element
    if (!frameRef.current || el === frameRef.current) {
      setHover(null)
      return
    }
    setHover((prev) => (prev?.el === el ? prev : { el, info: readElement(el), rect: el.getBoundingClientRect() }))
  }

  const draggable = (pin: Pin) => canPin && !pin.sent

  const onPointerDown = (pin: Pin, e: React.PointerEvent<HTMLButtonElement>) => {
    const origin = positions[pin.id]
    if (!draggable(pin) || !origin) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragInfo.current = { startX: e.clientX, startY: e.clientY, origin, moved: false }
  }

  const onPointerMove = (pin: Pin, e: React.PointerEvent<HTMLButtonElement>) => {
    const info = dragInfo.current
    if (!info) return
    const dx = e.clientX - info.startX
    const dy = e.clientY - info.startY
    if (!info.moved && Math.hypot(dx, dy) < 5) return
    info.moved = true
    setDrag({ id: pin.id, point: { left: info.origin.left + dx, top: info.origin.top + dy } })
  }

  const onPointerUp = (pin: Pin, e: React.PointerEvent<HTMLButtonElement>) => {
    const info = dragInfo.current
    dragInfo.current = null
    if (!info?.moved) return
    justDragged.current = true
    window.setTimeout(() => (justDragged.current = false), 0)
    setDrag(null)
    const loc = locate(e.clientX, e.clientY)
    if (loc) onMovePin(pin, loc)
  }

  const onPinKeyDown = (pin: Pin, e: React.KeyboardEvent) => {
    const steps: Record<string, [number, number]> = { ArrowLeft: [-8, 0], ArrowRight: [8, 0], ArrowUp: [0, -8], ArrowDown: [0, 8] }
    const step = steps[e.key]
    if (!step || !draggable(pin)) return
    e.preventDefault()
    const stage = stageRef.current?.getBoundingClientRect()
    const at = positions[pin.id]
    if (!stage || !at) return
    const loc = locate(stage.left + at.left + step[0], stage.top + at.top + step[1])
    if (loc) onMovePin(pin, loc)
  }

  const selected = ui.selectedPinId ? pins.find((p) => p.id === ui.selectedPinId && !p.deleted) : undefined
  const popupAt = ui.draft ? positions.draft : selected ? (drag?.id === selected.id ? drag.point : positions[selected.id]) : undefined

  const popupStyle = (): React.CSSProperties | undefined => {
    if (isPhone || !popupAt) return undefined
    let left = popupAt.left + 22
    if (left + POPUP_WIDTH > stageSize.width - 8) left = popupAt.left - 22 - POPUP_WIDTH
    left = Math.max(8, left)
    const top = Math.min(Math.max(8, popupAt.top - 16), Math.max(8, stageSize.height - POPUP_HEIGHT - 8))
    return { left, top }
  }

  const close = () => setUi({ selectedPinId: null, editing: false, draft: null })

  return (
    <div
      className={`stage ${fullscreen ? 'stage-full' : ''}`.trim()}
      ref={stageRef}
      onClick={(e) => e.target === e.currentTarget && close()}
      onScroll={measure}
    >
      <div className="stage-label">
        <span>Preview</span>
        <code>{review.branch}</code>
        {fullscreen ? (
          <span className="stage-tools">
            <button type="button" className="inspect-toggle" aria-pressed={inspect} onClick={onToggleInspect}>
              <Icon name="inspect" size={16} />
              Inspect
            </button>
            <button type="button" className="inspect-toggle" onClick={onExitFullscreen}>
              <Icon name="exitFullscreen" size={16} />
              Exit full screen
            </button>
          </span>
        ) : null}
      </div>
      <div
        className={`frame ${inspect ? 'frame-inspect' : ''}`.trim()}
        ref={frameRef}
        id={panelId}
        role="tabpanel"
        onClick={onFrameClick}
        onMouseMove={onFrameMove}
        onMouseLeave={() => setHover(null)}
      >
        <SampleScreen version={caseItem.version} groupId={caseItem.groupId} groupLabel={group?.label ?? caseItem.groupId} revision={review.revision} />
      </div>

      <div className="pin-layer">
        {inspect && hover && stageRef.current ? <InspectOverlay stage={stageRef.current} hover={hover} /> : null}
        {visible.map((pin) => {
          const at = drag?.id === pin.id ? drag.point : positions[pin.id]
          if (!at) return null
          const isSelected = ui.selectedPinId === pin.id
          return (
            <button
              key={pin.id}
              type="button"
              className={`pin ${isSelected ? 'pin-selected' : ''} ${draggable(pin) ? 'pin-draggable' : ''}`.trim()}
              style={{ left: at.left, top: at.top }}
              aria-label={`Pin ${pin.number}, ${statusWord(pin.status)}: ${pin.text.slice(0, 60)}`}
              aria-pressed={isSelected}
              onPointerDown={(e) => onPointerDown(pin, e)}
              onPointerMove={(e) => onPointerMove(pin, e)}
              onPointerUp={(e) => onPointerUp(pin, e)}
              onKeyDown={(e) => onPinKeyDown(pin, e)}
              onClick={(e) => {
                e.stopPropagation()
                if (justDragged.current) return
                setUi({ selectedPinId: pin.id, editing: false, draft: null })
              }}
            >
              <PinMark number={pin.number} status={pin.status} />
            </button>
          )
        })}

        {ui.draft && positions.draft ? (
          <span className="pin pin-draft" style={{ left: positions.draft.left, top: positions.draft.top }} aria-hidden="true">
            <PinMark number={nextNumber} status="needs-fix" />
          </span>
        ) : null}

        {(ui.draft || selected) && (popupAt || isPhone) ? (
          <>
            {isPhone ? <div className="sheet-backdrop" aria-hidden="true" /> : null}
            <CommentPopup
              key={ui.draft ? `draft:${ui.draft.target}:${ui.draft.x}:${ui.draft.y}` : `${selected?.id}-${ui.editing}`}
              style={popupStyle()}
              sheet={isPhone}
              pin={ui.draft ? undefined : selected}
              initialText={ui.draft?.text}
              number={ui.draft ? nextNumber : selected!.number}
              editing={Boolean(ui.draft) || ui.editing}
              canEdit={canEdit}
              onSave={(text) => {
                if (ui.draft) {
                  onAddPin(ui.draft, text)
                } else if (selected) {
                  onEditPin(selected, text)
                }
                close()
              }}
              onCancel={() => (ui.draft || !selected ? close() : setUi({ ...ui, editing: false }))}
              onClose={close}
              onEdit={() => setUi({ ...ui, editing: true })}
              onDelete={() => selected && onDeletePin(selected)}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}

function statusWord(status: Pin['status']): string {
  return { 'not-checked': 'not checked', waiting: 'waiting', 'needs-fix': 'needs fix', approved: 'approved' }[status]
}

type PopupProps = {
  style?: React.CSSProperties
  sheet: boolean
  pin?: Pin
  initialText?: string
  number: number
  editing: boolean
  canEdit: boolean
  onSave: (text: string) => void
  onCancel: () => void
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

/** The popup next to a pin (design system 4.21). Write mode for new and edited comments, read mode otherwise. */
function CommentPopup({ style, sheet, pin, initialText, number, editing, canEdit, onSave, onCancel, onClose, onEdit, onDelete }: PopupProps) {
  const [text, setText] = useState(pin?.text ?? initialText ?? '')
  const [error, setError] = useState('')

  const save = () => {
    if (!text.trim()) {
      setError('Write a comment first.')
      return
    }
    onSave(text)
  }

  return (
    <div
      className={`comment-popup ${sheet ? 'comment-sheet' : ''}`.trim()}
      style={style}
      role="dialog"
      aria-label={`Comment ${number}`}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          editing ? onCancel() : onClose()
        }
      }}
    >
      <div className="comment-head">
        <PinMark number={number} status={pin?.status ?? 'needs-fix'} small />
        <span className="comment-title">Comment {number}</span>
        {pin ? <StatusBadge status={pin.status} label={pinStatusLabel(pin)} /> : null}
      </div>

      {editing ? (
        <>
          <TextArea
            label="Comment"
            hideLabel
            placeholder="Say what to change"
            value={text}
            maxLength={500}
            countFrom={450}
            error={error}
            autoFocus
            onChange={(e) => {
              setText(e.target.value)
              setError('')
            }}
          />
          <div className="comment-actions">
            <Button size="small" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="small" variant="primary" onClick={save}>
              Save
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="comment-text">{pin?.text}</p>
          <div className="comment-actions comment-actions-read">
            {canEdit ? (
              <>
                <IconButton icon="pencil" label="Edit" className="comment-icon-btn" onClick={onEdit} />
                <IconButton icon="trash" label="Delete" className="comment-icon-btn btn-danger-text" onClick={onDelete} />
              </>
            ) : null}
            <Button size="small" onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

const fmt = (n: number) => `${Math.round(n * 10) / 10}`

/** The blue, green and orange boxes of dev tools, with a small card of numbers. */
function InspectOverlay({ stage, hover }: { stage: HTMLElement; hover: { info: InspectInfo; rect: DOMRect } }) {
  const s = stage.getBoundingClientRect()
  const { info, rect } = hover
  const left = rect.left - s.left
  const top = rect.top - s.top
  const m = info.margin
  const p = info.padding

  // The card sits under the element, or above it when there is no room.
  const cardWidth = 260
  const below = top + rect.height + 8 + 190 < s.height
  const cardLeft = Math.min(Math.max(8, left), Math.max(8, s.width - cardWidth - 8))
  const cardStyle: React.CSSProperties = below ? { left: cardLeft, top: top + rect.height + 8 } : { left: cardLeft, bottom: s.height - top + 8 }

  return (
    <>
      <div
        className="inspect-margin"
        style={{
          left: left - m.left,
          top: top - m.top,
          width: rect.width + m.left + m.right,
          height: rect.height + m.top + m.bottom,
          borderWidth: `${m.top}px ${m.right}px ${m.bottom}px ${m.left}px`,
        }}
      />
      <div
        className="inspect-box"
        style={{ left, top, width: rect.width, height: rect.height, borderWidth: `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px` }}
      />
      <div className="inspect-card" style={cardStyle} role="status">
        <p className="inspect-head">
          <span className="inspect-name">{info.name}</span>
          <span className="inspect-size">
            {fmt(info.width)} × {fmt(info.height)}
          </span>
        </p>
        {info.hasText ? (
          <>
            <p className="inspect-row">
              <span>Font</span>
              <span>
                {info.font} / {info.weight} / {info.lineHeight}
              </span>
            </p>
            <p className="inspect-row">
              <span>Family</span>
              <span>{info.family}</span>
            </p>
            <p className="inspect-row">
              <span>Color</span>
              <span>
                <i className="inspect-swatch" style={{ background: info.color }} />
                {info.color}
              </span>
            </p>
          </>
        ) : info.background !== 'none' ? (
          <p className="inspect-row">
            <span>Background</span>
            <span>
              <i className="inspect-swatch" style={{ background: info.background }} />
              {info.background}
            </span>
          </p>
        ) : null}
        <p className="inspect-row">
          <span>Padding</span>
          <span>{sidesText(info.padding)}</span>
        </p>
        <p className="inspect-row">
          <span>Margin</span>
          <span>{sidesText(info.margin)}</span>
        </p>
      </div>
    </>
  )
}
