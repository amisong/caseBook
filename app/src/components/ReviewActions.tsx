import { useRef, useState } from 'react'
import { PEOPLE } from '../lib/data'
import { caseIsClear, pinsToSend, plural } from '../lib/selectors'
import { useApp } from '../lib/store'
import type { Review } from '../lib/types'
import { Button } from './Button'
import { Popover } from './Popover'
import { useToast } from './Toast'

/** The one big button at the right of the bottom bar on the case screen. Its label changes with the situation. */
export function ReviewActions({
  review,
  onSent,
}: {
  review: Review
  /** Called after the designer sends the fixes. */ onSent?: () => void
}) {
  const { state, dispatch } = useApp()
  const showToast = useToast()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const role = state.role

  if (review.stage === 'approved') return null

  const close = () => setOpen(false)
  let content: React.ReactNode = null

  if (role === 'designer') {
    if (review.phase === 'developer') {
      content = <span className="waiting-note">Waiting on {PEOPLE.developer.name}</span>
    } else {
      const allApproved = review.cases.length > 0 && review.cases.every((c) => caseIsClear(review, c))
      const sending = pinsToSend(review)

      if (allApproved) {
        content = (
          <>
            <Button ref={triggerRef} variant="primary" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              Approve and finish
            </Button>
            <Popover open={open} onClose={close} triggerRef={triggerRef} label="Approve and finish" width={300}>
              <p className="popover-title">Approve all cases?</p>
              <p className="popover-text">{PEOPLE.developer.name} can merge.</p>
              <div className="popover-actions">
                <Button size="small" variant="ghost" onClick={close}>
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="primary"
                  onClick={() => {
                    dispatch({ type: 'approveReview', reviewId: review.id })
                    close()
                    showToast('Review approved')
                  }}
                >
                  Approve
                </Button>
              </div>
            </Popover>
          </>
        )
      } else {
        content = (
          <>
            <Button ref={triggerRef} variant="primary" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              Send to developer
            </Button>
            <Popover open={open} onClose={close} triggerRef={triggerRef} label="Send to developer" width={300}>
              {sending.length === 0 ? (
                <>
                  <p className="popover-title">Nothing to send yet</p>
                  <p className="popover-text">Add a pin to a case first.</p>
                  <div className="popover-actions">
                    <Button size="small" onClick={close}>
                      Close
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="popover-title">All done? We will send your comments to {PEOPLE.developer.name}.</p>
                  <div className="popover-actions">
                    <Button size="small" variant="ghost" onClick={close}>
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="primary"
                      onClick={() => {
                        dispatch({ type: 'sendFixes', reviewId: review.id })
                        close()
                        onSent?.()
                        showToast(`Sent to ${PEOPLE.developer.name}`)
                      }}
                    >
                      Send
                    </Button>
                  </div>
                </>
              )}
            </Popover>
          </>
        )
      }
    }
  } else if (review.phase === 'designer') {
    content = <span className="waiting-note">Waiting on {PEOPLE.designer.name}</span>
  } else {
    const waiting = review.pins.filter((p) => !p.deleted && p.status === 'waiting')
    const openItems = waiting.filter((p) => !p.devFixed).length
    const send = () => {
      dispatch({ type: 'readyForRecheck', reviewId: review.id })
      close()
      showToast(`Sent to ${PEOPLE.designer.name}`)
    }
    content = (
      <>
        <Button ref={triggerRef} variant="primary" aria-expanded={open} onClick={() => (openItems > 0 ? setOpen((v) => !v) : send())}>
          Ready for re-check
        </Button>
        <Popover open={open} onClose={close} triggerRef={triggerRef} label="Ready for re-check" width={300}>
          <p className="popover-title">
            {plural(openItems, 'item')} {openItems === 1 ? 'is' : 'are'} still open
          </p>
          <p className="popover-text">Send anyway?</p>
          <div className="popover-actions">
            <Button size="small" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button size="small" variant="primary" onClick={send}>
              Send anyway
            </Button>
          </div>
        </Popover>
      </>
    )
  }

  return content ? <div className="actions-anchor">{content}</div> : null
}
