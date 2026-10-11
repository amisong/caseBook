import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { EmptyState } from '../components/EmptyState'
import { TextInput } from '../components/TextInput'
import { useToast } from '../components/Toast'
import { firstCaseId, plural } from '../lib/selectors'
import { useApp, useReview } from '../lib/store'
import type { UserGroup } from '../lib/types'

type GroupKey = 'versions' | 'groups'

/** The states in boxes, one box for each section such as "Logged in". States without a section share one box. */
function sectionsOf(list: UserGroup[]): { title: string; groups: UserGroup[] }[] {
  const out: { title: string; groups: UserGroup[] }[] = []
  for (const group of list) {
    const title = group.section ?? 'States'
    const found = out.find((o) => o.title === title)
    if (found) found.groups.push(group)
    else out.push({ title, groups: [group] })
  }
  return out
}

/** Thin lines and dots that spread out from the middle of the loading screen. The same every time. */
const RAYS = Array.from({ length: 72 }, (_, i) => {
  const noise = (n: number) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  const angle = (i / 72) * Math.PI * 2 + noise(1) * 0.05
  const from = 52 + noise(2) * 18
  const to = from + 24 + noise(3) * 84
  return {
    x1: Math.cos(angle) * from,
    y1: Math.sin(angle) * from,
    x2: Math.cos(angle) * to,
    y2: Math.sin(angle) * to,
    dot: 0.8 + noise(4) * 1.4,
    delay: noise(5) * 0.5,
  }
})

/** The designer confirms what the AI found: A/B test versions and states. */
export function ConfirmPage() {
  const { id } = useParams()
  const review = useReview(id)
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const showToast = useToast()

  const [warning, setWarning] = useState<GroupKey | null>(null)
  const [reporting, setReporting] = useState(false)
  const [newName, setNewName] = useState('')
  const [addError, setAddError] = useState('')
  const [connecting, setConnecting] = useState(false)
  const timer = useRef<number>()
  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (!review) {
    return (
      <div className="page">
        <EmptyState icon="alert" title="We cannot find this request" text="It may have been removed.">
          <Link to="/" className="btn btn-primary empty-action">
            Go to start
          </Link>
        </EmptyState>
      </div>
    )
  }

  // After the designer confirmed, this page is done. Go to the cases.
  if (review.stage !== 'requested' && review.cases.length > 0) {
    return <Navigate to={`/review/${review.id}/cases/${firstCaseId(review)}`} replace />
  }

  const designer = state.role === 'designer'
  const versions = review.selectedVersions
  const groups = review.selectedGroupIds

  const toggle = (key: GroupKey, value: string) => {
    const list = key === 'versions' ? versions : groups
    let next: string[]
    if (list.includes(value)) {
      // The last chip in a group stays on.
      if (list.length === 1) {
        setWarning(key)
        return
      }
      next = list.filter((v) => v !== value)
    } else {
      next = [...list, value]
    }
    setWarning(null)
    dispatch({
      type: 'setSelection',
      reviewId: review.id,
      versions: key === 'versions' ? next : versions,
      groupIds: key === 'groups' ? next : groups,
    })
  }

  const caseCount = versions.length * groups.length

  const finish = () => {
    dispatch({ type: 'confirmCases', reviewId: review.id })
    // The cases exist after the store updates. The first case id follows the same rule as the store.
    const first = `${versions[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${groups[0]}`
    navigate(`/review/${review.id}/cases/${first}`)
  }

  // The first time, adding the project takes a moment. Show a short loading screen in between.
  const confirm = () => {
    if (state.projects.find((p) => p.id === review.projectId)?.listed === false) {
      setConnecting(true)
      timer.current = window.setTimeout(finish, 3000)
      return
    }
    finish()
  }

  const closeAdd = () => {
    setReporting(false)
    setNewName('')
    setAddError('')
  }

  const submitAdd = () => {
    if (!newName.trim()) {
      setAddError('Write what is missing first.')
      return
    }
    closeAdd()
    showToast('Thanks. We will look again.')
  }

  if (connecting) {
    const project = state.projects.find((p) => p.id === review.projectId)
    return (
      <div className="connecting" role="status">
        <div className="connecting-art" aria-hidden="true">
          <svg className="connecting-rays" viewBox="-180 -180 360 360" width="360" height="360">
            {RAYS.map((ray, i) => (
              <g key={i} className="connecting-ray" style={{ animationDelay: `${1 + ray.delay}s` }}>
                <line x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2} />
                <circle cx={ray.x2} cy={ray.y2} r={ray.dot} />
              </g>
            ))}
          </svg>
          <div className="connecting-tile">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path pathLength="1" d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
            </svg>
          </div>
        </div>
        <p className="connecting-title">
          Adding the project
          <span className="connecting-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </p>
        <p className="connecting-name">{project?.name}</p>
        <div className="connecting-bar" aria-hidden="true">
          <div className="connecting-fill" />
        </div>
      </div>
    )
  }

  return (
    <div className="page confirm">
      <h1 className="title">{review.branch}</h1>
      <p className="confirm-meta">Asked by {review.requestedBy}</p>

      {!designer ? (
        <div className="ai-message">
          <p className="label">Waiting</p>
          <p>Emma will confirm what to check. You get a message when the review starts.</p>
        </div>
      ) : (
        <>
          <section className="chip-group" aria-labelledby="group-users">
            <h2 className="heading" id="group-users">
              Found cases
            </h2>
            <div className="case-cards" role="group" aria-labelledby="group-users">
              {sectionsOf(review.groups).map((section) => (
                <fieldset key={section.title} className="case-box">
                  <legend className="case-box-title">{section.title}</legend>
                  {section.groups.map((group) => {
                    const on = groups.includes(group.id)
                    return (
                      <label key={group.id} className={`case-card ${on ? 'case-card-on' : ''}`.trim()}>
                        <input type="checkbox" className="check" checked={on} onChange={() => toggle('groups', group.id)} />
                        <span className="case-card-text">
                          <span className="case-card-title">{group.label}</span>
                          <span className="case-card-desc">{group.text}</span>
                        </span>
                      </label>
                    )
                  })}
                </fieldset>
              ))}
            </div>
            {warning === 'groups' ? <p className="field-error">Keep at least one on.</p> : null}
          </section>

          <div className="confirm-actions">
            <Button variant="primary" onClick={confirm}>
              {`Yes, show ${plural(caseCount, 'case')}`}
            </Button>
            <Button onClick={() => setReporting(true)}>Something is missing</Button>
          </div>
        </>
      )}

      <Dialog open={reporting} title="What did we miss?" onClose={closeAdd}>
        <p className="dialog-text">Tell us what is missing. We will go back and find it.</p>
        <TextInput
          label="What is missing?"
          placeholder="I heard you run an A/B test, but I do not see it in the cases."
          value={newName}
          error={addError}
          onChange={(e) => {
            setNewName(e.target.value)
            setAddError('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submitAdd()
            }
          }}
        />
        <div className="dialog-actions">
          <Button variant="ghost" onClick={closeAdd}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitAdd}>
            Send
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
