import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAddProject } from '../components/AddProject'
import { Button } from '../components/Button'
import { Checkbox } from '../components/Checkbox'
import { EmptyState } from '../components/EmptyState'
import { Select } from '../components/Select'
import { TextInput } from '../components/TextInput'
import { useToast } from '../components/Toast'
import { DEMO_BRANCHES, DESIGNERS, PEOPLE } from '../lib/data'
import { projectTitle } from '../lib/repoAddress'
import { useApp } from '../lib/store'

type Errors = { feature?: string; reviewers?: string }

/** The developer asks for a design check. */
export function RequestPage() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const showToast = useToast()
  const openAddProject = useAddProject()

  const [projectId, setProjectId] = useState(state.projects[0]?.id ?? '')
  const [branch, setBranch] = useState(DEMO_BRANCHES[0])
  const [feature, setFeature] = useState('')
  const [note, setNote] = useState('')
  const [reviewers, setReviewers] = useState<string[]>([PEOPLE.designer.name])
  const [errors, setErrors] = useState<Errors>({})

  if (state.role !== 'developer') {
    return (
      <div className="page">
        <EmptyState icon="alert" title="This page is for developers" text="Switch to the Developer view in the sidebar to try it.">
          <Link to="/" className="btn btn-secondary empty-action">
            Go to start
          </Link>
        </EmptyState>
      </div>
    )
  }

  if (state.projects.length === 0) {
    return (
      <div className="page">
        <EmptyState title="Add a project first" text="A design check needs a project.">
          <Button variant="primary" className="empty-action" onClick={openAddProject}>
            Add project
          </Button>
        </EmptyState>
      </div>
    )
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (!feature.trim()) next.feature = 'Write a feature name. Example: "Cart page".'
    if (reviewers.length === 0) next.reviewers = 'Pick at least one reviewer.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    dispatch({
      type: 'createReview',
      projectId,
      name: feature.trim(),
      requestedBy: PEOPLE.developer.name,
      note: note.trim(),
      branch,
      reviewers,
    })
    showToast(`Request sent to ${reviewers.join(' and ')}`)
    navigate('/')
  }

  const toggleReviewer = (name: string, on: boolean) => {
    setReviewers((list) => (on ? [...list, name] : list.filter((n) => n !== name)))
    setErrors((e) => ({ ...e, reviewers: undefined }))
  }

  return (
    <div className="page">
      <h1 className="title">Request design QA</h1>
      <p className="confirm-meta">Ask a designer to check every case of a feature before you merge.</p>

      <form className="form" onSubmit={onSubmit} noValidate>
        {state.projects.length > 1 ? (
          <Select label="Project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            {state.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {projectTitle(p.name)}
              </option>
            ))}
          </Select>
        ) : null}

        <Select
          label="Work to check"
          hint="The branch with your changes."
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          {DEMO_BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>

        <TextInput
          label="Feature name"
          hint="The designer sees this name everywhere."
          placeholder="Cart page"
          value={feature}
          error={errors.feature}
          onChange={(e) => {
            setFeature(e.target.value)
            setErrors((x) => ({ ...x, feature: undefined }))
          }}
        />

        <TextInput
          label="Note"
          hint="One line. What changes on screen?"
          placeholder="Cart changes by state and A/B test"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <fieldset className="fieldset">
          <legend className="field-label">Who should review</legend>
          {DESIGNERS.map((name) => (
            <Checkbox key={name} label={name} checked={reviewers.includes(name)} onChange={(on) => toggleReviewer(name, on)} />
          ))}
          {errors.reviewers ? <p className="field-error">{errors.reviewers}</p> : null}
        </fieldset>

        <Button type="submit" variant="primary">
          Send request
        </Button>
      </form>
    </div>
  )
}
