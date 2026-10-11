import { PEOPLE } from './data'
import type { CaseItem, Pin, Review, ReviewStatus, Role } from './types'

/** The state name with its section, such as "Logged out: Sold out". */
export function groupName(group: { label: string; section?: string }): string {
  return group.section ? `${group.section}: ${group.label}` : group.label
}

export function caseLabel(review: Review, c: CaseItem): string {
  const group = review.groups.find((g) => g.id === c.groupId)
  const name = group ? groupName(group) : c.groupId
  // With one version only, the state name is enough.
  if (review.abTests.every((t) => t.versions.length <= 1)) return name
  return `${c.version} + ${name}`
}

/** The section and the short name of a case, for lists that show sections. */
export function caseParts(review: Review, c: CaseItem): { section?: string; short: string } {
  const group = review.groups.find((g) => g.id === c.groupId)
  const single = review.abTests.every((t) => t.versions.length <= 1)
  const short = group?.label ?? c.groupId
  return { section: group?.section, short: single ? short : `${c.version} + ${short}` }
}

/** Pins the person can see. Deleted pins stay as a quiet line only if the developer already got them. */
export function visiblePins(review: Review, caseId: string): Pin[] {
  return review.pins.filter((p) => p.caseId === caseId && (!p.deleted || p.sent))
}

export function livePins(review: Review, caseId?: string): Pin[] {
  return review.pins.filter((p) => !p.deleted && (caseId === undefined || p.caseId === caseId))
}

/** The status shown in the sidebar. Approved only after the designer finishes. */
export function reviewStatus(review: Review): ReviewStatus {
  if (review.stage === 'approved') return 'approved'
  if (review.cases.some((c) => c.status === 'needs-fix')) return 'needs-fix'
  if (review.cases.some((c) => c.status === 'waiting')) return 'waiting'
  return 'not-checked'
}

export function isWaitingOn(review: Review, role: Role): boolean {
  if (review.stage === 'approved') return false
  return role === 'designer' ? review.phase === 'designer' : review.phase === 'developer'
}

/** Pins that go to the developer when the designer sends. */
export function pinsToSend(review: Review): Pin[] {
  return review.pins.filter((p) => {
    if (p.deleted || p.status !== 'needs-fix') return false
    return review.cases.find((c) => c.id === p.caseId)?.status === 'needs-fix'
  })
}

/** A case is fine when the designer approved it, or when it has no comments left to decide on. */
export function caseIsClear(review: Review, c: CaseItem): boolean {
  return c.status === 'approved' || (c.status === 'not-checked' && livePins(review, c.id).length === 0)
}

export function casesToCheck(review: Review): CaseItem[] {
  return review.cases.filter((c) => c.status === 'not-checked')
}

export function isRecheck(review: Review): boolean {
  return review.round > 1 && review.phase === 'designer' && review.stage !== 'approved'
}

export function firstCaseId(review: Review): string | undefined {
  const next = review.cases.find((c) => c.status === 'not-checked') ?? review.cases[0]
  return next?.id
}

export function reviewPath(review: Review): string {
  if (review.stage === 'requested' || review.cases.length === 0) return `/review/${review.id}/confirm`
  return `/review/${review.id}/cases/${firstCaseId(review)}`
}

export function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

export function nameOf(role: Role): string {
  return PEOPLE[role].name
}

/** Sidebar sort: things that need this person first, finished things last. */
export function sortReviews(reviews: Review[], role: Role): Review[] {
  const rank = (r: Review) => {
    if (r.stage === 'approved') return 2
    return isWaitingOn(r, role) ? 0 : 1
  }
  return [...reviews].sort((a, b) => rank(a) - rank(b))
}
