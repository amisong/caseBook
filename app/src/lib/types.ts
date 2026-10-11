export type Role = 'designer' | 'developer'
export type ReviewStatus = 'not-checked' | 'waiting' | 'needs-fix' | 'approved'
export type AiMark = 'likely-fixed' | 'not-sure' | 'no-change'
export type Release = 'not-merged' | 'merged' | 'deployed'
/** Who holds the review right now. */
export type Phase = 'designer' | 'developer'
/** requested: the designer has not confirmed yet. in-review: cases exist. approved: finished. */
export type Stage = 'requested' | 'in-review' | 'approved'

export type AbTest = { name: string; versions: string[]; text: string }
/** A state to check. `section` groups states in lists, such as "Logged out". */
export type UserGroup = { id: string; label: string; text: string; section?: string }

export type CaseItem = {
  id: string
  version: string
  groupId: string
  status: ReviewStatus
  /** True when the developer fixed something in this case. Used by the re-check view. */
  changed: boolean
}

export type Pin = {
  id: string
  caseId: string
  /** Shown as 1, 2, 3. Never reused inside a case. */
  number: number
  /** The element the pin points at, and the place inside it (percent). */
  target: string
  x: number
  y: number
  text: string
  author: string
  createdAt: number
  edited: boolean
  round: number
  status: ReviewStatus
  /** True once the pin was part of a message to the developer. */
  sent: boolean
  deleted: boolean
  devFixed: boolean
  devNote: string
  aiMark: AiMark | null
  stillNote: string
  /** An older comment that is already fixed. Hidden in the re-check unless the designer asks for it. */
  earlier?: boolean
}

export type Review = {
  id: string
  projectId: string
  name: string
  requestedBy: string
  note: string
  branch: string
  reviewers: string[]
  abTests: AbTest[]
  groups: UserGroup[]
  selectedVersions: string[]
  selectedGroupIds: string[]
  stage: Stage
  phase: Phase
  round: number
  /** The developer's code version. Goes up with each push. */
  revision: number
  cases: CaseItem[]
  pins: Pin[]
  pinCounter: Record<string, number>
  changesAfterSend: number
  release: Release
}

export type Project = {
  id: string
  name: string
  url: string
  /** False until the designer confirms the first request. The designer's list hides it until then. */
  listed?: boolean
}

export type Notice = {
  id: string
  role: Role
  message: string
  createdAt: number
  read: boolean
  to: string
}

export type AppState = {
  role: Role
  projects: Project[]
  reviews: Review[]
  notices: Notice[]
  seq: number
}
