import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { DEMO_AB_TESTS, DEMO_GROUPS, PEOPLE } from './data'
import { caseIsClear, firstCaseId, livePins, pinsToSend, plural } from './selectors'
import { readStored, writeStored } from './storage'
import type { AppState, CaseItem, Pin, Project, Release, Review, ReviewStatus, Role } from './types'

/**
 * One store for the whole demo: projects, reviews, pins and notifications.
 * It lives in this browser only. Later it is replaced by real calls to a server.
 */

const KEY = 'casebook.state.v9'

export type Action =
  | { type: 'reset' }
  | { type: 'setRole'; role: Role }
  | { type: 'addProject'; project: Project }
  | { type: 'createReview'; projectId: string; name: string; requestedBy: string; note: string; branch: string; reviewers: string[] }
  | { type: 'setSelection'; reviewId: string; versions: string[]; groupIds: string[] }
  | { type: 'addCustom'; reviewId: string; kind: 'version' | 'group'; name: string }
  | { type: 'confirmCases'; reviewId: string }
  | { type: 'setCaseStatus'; reviewId: string; caseId: string; status: ReviewStatus }
  | { type: 'addPin'; reviewId: string; caseId: string; target: string; x: number; y: number; text: string }
  | { type: 'editPin'; reviewId: string; pinId: string; text: string }
  | { type: 'movePin'; reviewId: string; pinId: string; target: string; x: number; y: number }
  | { type: 'deletePin'; reviewId: string; pinId: string }
  | { type: 'restorePin'; reviewId: string; pinId: string }
  | { type: 'sendFixes'; reviewId: string }
  | { type: 'markFixed'; reviewId: string; pinId: string; fixed: boolean; note?: string }
  | { type: 'readyForRecheck'; reviewId: string }
  | { type: 'decidePin'; reviewId: string; pinId: string; decision: 'resolved' | 'still'; note?: string }
  | { type: 'approveReview'; reviewId: string }
  | { type: 'setRelease'; reviewId: string; release: Release }
  | { type: 'markNoticeRead'; id: string }
  | { type: 'markAllRead'; role: Role }

const emptyState: AppState = { role: 'designer', projects: [], reviews: [], notices: [], seq: 1 }

function slug(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'item'
  )
}

function fixes(count: number): string {
  return count === 1 ? '1 fix' : `${count} fixes`
}

function updateReview(state: AppState, id: string, fn: (r: Review) => Review): AppState {
  let changed = false
  const reviews = state.reviews.map((r) => {
    if (r.id !== id) return r
    changed = true
    return fn(r)
  })
  return changed ? { ...state, reviews } : state
}

function notify(state: AppState, notice: { id?: string; role: Role; message: string; to: string }): AppState {
  const id = notice.id ?? `n${state.seq}`
  const next = { id, role: notice.role, message: notice.message, to: notice.to, read: false, createdAt: Date.now() }
  const exists = state.notices.some((n) => n.id === id)
  return {
    ...state,
    seq: state.seq + 1,
    notices: exists ? state.notices.map((n) => (n.id === id ? next : n)) : [next, ...state.notices],
  }
}

function casePath(review: Review, caseId: string | undefined, recheck = false): string {
  return `/review/${review.id}/cases/${caseId ?? firstCaseId(review) ?? ''}${recheck ? '?view=recheck' : ''}`
}

function buildCases(versions: string[], groupIds: string[], previous: CaseItem[]): CaseItem[] {
  const cases: CaseItem[] = []
  for (const version of versions) {
    for (const groupId of groupIds) {
      const id = `${slug(version)}-${groupId}`
      cases.push(previous.find((c) => c.id === id) ?? { id, version, groupId, status: 'not-checked', changed: false })
    }
  }
  return cases
}

/** Case status after the designer decided on every pin of a case in the re-check. */
function settleCase(review: Review, caseId: string): Review {
  const pins = livePins(review, caseId)
  if (pins.length === 0 || pins.some((p) => p.status === 'not-checked')) return review
  const status: ReviewStatus = pins.every((p) => p.status === 'approved') ? 'approved' : 'needs-fix'
  return { ...review, cases: review.cases.map((c) => (c.id === caseId ? { ...c, status } : c)) }
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'reset':
      return initialState

    case 'setRole':
      return { ...state, role: action.role }

    case 'addProject':
      return state.projects.some((p) => p.id === action.project.id)
        ? state
        : { ...state, projects: [...state.projects, action.project] }

    case 'createReview': {
      const base = slug(action.name)
      let id = base
      for (let n = 2; state.reviews.some((r) => r.id === id); n++) id = `${base}-${n}`
      const review: Review = {
        id,
        projectId: action.projectId,
        name: action.name,
        requestedBy: action.requestedBy,
        note: action.note,
        branch: action.branch,
        reviewers: action.reviewers,
        abTests: DEMO_AB_TESTS.map((t) => ({ ...t, versions: [...t.versions] })),
        groups: DEMO_GROUPS.map((g) => ({ ...g })),
        selectedVersions: DEMO_AB_TESTS.flatMap((t) => t.versions),
        selectedGroupIds: DEMO_GROUPS.map((g) => g.id),
        stage: 'requested',
        phase: 'designer',
        round: 1,
        revision: 1,
        cases: [],
        pins: [],
        pinCounter: {},
        changesAfterSend: 0,
        release: 'not-merged',
      }
      const next = { ...state, reviews: [...state.reviews, review] }
      return notify(next, {
        id: `request-${id}`,
        role: 'designer',
        message: `${action.requestedBy} asked you to check ${action.name}.`,
        to: `/review/${id}/confirm`,
      })
    }

    case 'setSelection':
      return updateReview(state, action.reviewId, (r) => ({
        ...r,
        selectedVersions: action.versions,
        selectedGroupIds: action.groupIds,
      }))

    case 'addCustom':
      return updateReview(state, action.reviewId, (r) => {
        const name = action.name.trim()
        if (!name) return r
        if (action.kind === 'version') {
          if (r.abTests[0].versions.includes(name)) return r
          const abTests = r.abTests.map((t, i) => (i === 0 ? { ...t, versions: [...t.versions, name] } : t))
          return { ...r, abTests, selectedVersions: [...r.selectedVersions, name] }
        }
        const id = slug(name)
        if (r.groups.some((g) => g.id === id)) return r
        return {
          ...r,
          groups: [...r.groups, { id, label: name, text: 'Added by you.' }],
          selectedGroupIds: [...r.selectedGroupIds, id],
        }
      })

    case 'confirmCases': {
      const next = updateReview(state, action.reviewId, (r) => ({
        ...r,
        stage: r.stage === 'requested' ? 'in-review' : r.stage,
        cases: buildCases(r.selectedVersions, r.selectedGroupIds, r.cases),
      }))
      const projectId = state.reviews.find((r) => r.id === action.reviewId)?.projectId
      return {
        ...next,
        projects: next.projects.map((p) => (p.id === projectId && p.listed === false ? { ...p, listed: true } : p)),
      }
    }

    case 'setCaseStatus':
      return updateReview(state, action.reviewId, (r) => {
        const c = r.cases.find((x) => x.id === action.caseId)
        if (!c || r.phase !== 'designer' || r.stage === 'approved') return r
        const pins = livePins(r, c.id)
        if (action.status === 'approved' && pins.some((p) => p.status !== 'approved')) return r
        if (action.status === 'needs-fix' && pins.length === 0) return r
        return { ...r, cases: r.cases.map((x) => (x.id === c.id ? { ...x, status: action.status } : x)) }
      })

    case 'addPin':
      return updateReview(state, action.reviewId, (r) => {
        const text = action.text.trim()
        const c = r.cases.find((x) => x.id === action.caseId)
        if (!text || !c || r.stage === 'approved') return r
        const number = (r.pinCounter[c.id] ?? 0) + 1
        const pin: Pin = {
          id: `pin-${r.pins.length + 1}-${Date.now().toString(36)}`,
          caseId: c.id,
          number,
          target: action.target,
          x: action.x,
          y: action.y,
          text,
          author: PEOPLE.designer.name,
          createdAt: Date.now(),
          edited: false,
          round: r.round,
          status: 'needs-fix',
          sent: false,
          deleted: false,
          devFixed: false,
          devNote: '',
          aiMark: null,
          stillNote: '',
        }
        // A new pin means this case needs a fix.
        const cases = r.cases.map((x) => (x.id === c.id ? { ...x, status: 'needs-fix' as const } : x))
        return { ...r, cases, pins: [...r.pins, pin], pinCounter: { ...r.pinCounter, [c.id]: number } }
      })

    case 'editPin':
    case 'deletePin': {
      const next = updateReview(state, action.reviewId, (r) => {
        const pin = r.pins.find((p) => p.id === action.pinId)
        if (!pin) return r
        const text = action.type === 'editPin' ? action.text.trim() : pin.text
        if (action.type === 'editPin' && (!text || text === pin.text)) return r
        const touchesDeveloper = pin.sent && r.phase === 'developer'
        let review: Review = {
          ...r,
          pins: r.pins.map((p) =>
            p.id !== pin.id ? p : action.type === 'editPin' ? { ...p, text, edited: true } : { ...p, deleted: true },
          ),
          changesAfterSend: touchesDeveloper ? r.changesAfterSend + 1 : r.changesAfterSend,
        }
        if (action.type === 'deletePin' && livePins(review, pin.caseId).length === 0) {
          // No pins left: the case cannot stay marked Needs fix.
          review = {
            ...review,
            cases: review.cases.map((c) => (c.id === pin.caseId && c.status === 'needs-fix' ? { ...c, status: 'not-checked' } : c)),
          }
        }
        return review
      })
      const review = next.reviews.find((r) => r.id === action.reviewId)
      const pin = review?.pins.find((p) => p.id === action.pinId)
      if (review && pin && pin.sent && review.phase === 'developer') {
        return notify(next, {
          id: `changes-${review.id}-${review.round}`,
          role: 'developer',
          message: `${PEOPLE.designer.name} changed ${plural(review.changesAfterSend, 'comment')} on ${review.name}.`,
          to: casePath(review, pin.caseId),
        })
      }
      return next
    }

    case 'restorePin':
      return updateReview(state, action.reviewId, (r) => ({
        ...r,
        pins: r.pins.map((p) => (p.id === action.pinId ? { ...p, deleted: false } : p)),
      }))

    case 'movePin':
      return updateReview(state, action.reviewId, (r) => ({
        ...r,
        pins: r.pins.map((p) =>
          p.id === action.pinId && !p.sent ? { ...p, target: action.target, x: action.x, y: action.y } : p,
        ),
      }))

    case 'sendFixes': {
      const review = state.reviews.find((r) => r.id === action.reviewId)
      if (!review || review.phase !== 'designer' || review.stage !== 'in-review') return state
      const sending = pinsToSend(review)
      if (sending.length === 0) return state
      const ids = new Set(sending.map((p) => p.id))
      const next = updateReview(state, review.id, (r) => ({
        ...r,
        phase: 'developer',
        changesAfterSend: 0,
        pins: r.pins.map((p) =>
          ids.has(p.id) ? { ...p, status: 'waiting', sent: true, devFixed: false, devNote: '', aiMark: null } : p,
        ),
        cases: r.cases.map((c) => (c.status === 'needs-fix' ? { ...c, status: 'waiting', changed: false } : c)),
      }))
      const updated = next.reviews.find((r) => r.id === review.id)!
      const firstWaiting = updated.cases.find((c) => c.status === 'waiting')
      return notify(next, {
        id: `sent-${review.id}-${review.round}-${state.seq}`,
        role: 'developer',
        message: `${PEOPLE.designer.name} sent ${fixes(sending.length)} for ${review.name}.`,
        to: casePath(updated, firstWaiting?.id),
      })
    }

    case 'markFixed':
      return updateReview(state, action.reviewId, (r) => ({
        ...r,
        pins: r.pins.map((p) =>
          p.id === action.pinId ? { ...p, devFixed: action.fixed, devNote: action.note ?? p.devNote } : p,
        ),
      }))

    case 'readyForRecheck': {
      const review = state.reviews.find((r) => r.id === action.reviewId)
      if (!review || review.phase !== 'developer') return state
      const count = review.pins.filter((p) => !p.deleted && p.status === 'waiting').length
      // Demo: we cannot really fix the code. So one comment stays as "not fully fixed", picked at random.
      // The others count as fixed. They are kept as earlier comments, hidden unless the designer asks for them.
      const waitingPins = review.pins.filter((p) => !p.deleted && p.status === 'waiting')
      const left = waitingPins.length > 0 ? waitingPins[state.seq % waitingPins.length] : undefined
      const next = updateReview(state, review.id, (r) => ({
        ...r,
        phase: 'designer',
        round: r.round + 1,
        pins: r.pins.map((p) => {
          if (p.deleted || p.status !== 'waiting') return p
          if (p.id === left?.id) return { ...p, status: 'not-checked', aiMark: 'no-change' }
          return { ...p, status: 'approved', earlier: true }
        }),
        cases: r.cases.map((c) => ({
          ...c,
          status: c.status === 'waiting' ? (c.id === left?.caseId ? 'not-checked' : 'approved') : c.status,
          changed: c.id === left?.caseId,
        })),
      }))
      const updated = next.reviews.find((r) => r.id === review.id)!
      const firstChanged = updated.cases.find((c) => c.changed)
      return notify(next, {
        id: `recheck-${review.id}-${updated.round}`,
        role: 'designer',
        message: `${PEOPLE.developer.name} fixed ${plural(count, 'thing')} in ${review.name}. Check again.`,
        to: casePath(updated, firstChanged?.id, true),
      })
    }

    case 'decidePin':
      return updateReview(state, action.reviewId, (r) => {
        const pin = r.pins.find((p) => p.id === action.pinId)
        if (!pin || pin.status !== 'not-checked' || r.phase !== 'designer') return r
        const status: ReviewStatus = action.decision === 'resolved' ? 'approved' : 'needs-fix'
        const withPin: Review = {
          ...r,
          pins: r.pins.map((p) =>
            p.id === pin.id ? { ...p, status, stillNote: action.decision === 'still' ? (action.note ?? '').trim() : '' } : p,
          ),
        }
        return settleCase(withPin, pin.caseId)
      })

    case 'approveReview': {
      const review = state.reviews.find((r) => r.id === action.reviewId)
      if (!review || review.phase !== 'designer' || review.cases.length === 0) return state
      if (review.cases.some((c) => !caseIsClear(review, c))) return state
      const next = updateReview(state, review.id, (r) => ({ ...r, stage: 'approved', release: 'not-merged' }))
      return notify(next, {
        id: `approved-${review.id}`,
        role: 'developer',
        message: `${PEOPLE.designer.name} approved ${review.name}. You can merge.`,
        to: casePath(review, firstCaseId(review)),
      })
    }

    case 'setRelease':
      return updateReview(state, action.reviewId, (r) => (r.stage === 'approved' ? { ...r, release: action.release } : r))

    case 'markNoticeRead':
      return { ...state, notices: state.notices.map((n) => (n.id === action.id ? { ...n, read: true } : n)) }

    case 'markAllRead':
      return {
        ...state,
        notices: state.notices.map((n) => (n.role === action.role ? { ...n, read: true } : n)),
      }
  }
}

type StoreValue = { state: AppState; dispatch: Dispatch<Action> }
/** The demo starts with one project and a request from the developer, so the designer sees a notification at once. */
function seedDemo(): AppState {
  const projectId = 'github.com/acme/clearwell-frontend'
  const withProject = reducer(emptyState, {
    type: 'addProject',
    project: { id: projectId, name: 'clearwell-frontend', url: 'https://github.com/acme/clearwell-frontend', listed: false },
  })
  return reducer(withProject, {
    type: 'createReview',
    projectId,
    name: 'Cart page',
    requestedBy: PEOPLE.developer.name,
    note: 'Cart changes by state and A/B test.',
    branch: 'feature/cart-page',
    reviewers: [PEOPLE.designer.name],
  })
}

export const initialState: AppState = seedDemo()

const StoreContext = createContext<StoreValue>({ state: initialState, dispatch: () => {} })

export function useApp() {
  return useContext(StoreContext)
}

export function useReview(id: string | undefined): Review | undefined {
  const { state } = useApp()
  return state.reviews.find((r) => r.id === id)
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    // Opening the first page always starts the demo from the beginning.
    // Opening any other page keeps the saved progress, so a refresh does not lose work.
    window.location.pathname === '/' ? initialState : { ...initialState, ...readStored<Partial<AppState>>(KEY, {}) },
  )

  useEffect(() => {
    writeStored(KEY, state)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
