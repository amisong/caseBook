import { forwardRef } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { DEMO_OTHER_BRANCHES } from '../lib/data'
import { useApp } from '../lib/store'
import { reviewPath, sortReviews } from '../lib/selectors'
import type { Project, Review } from '../lib/types'
import { PhaseBadge, ReleaseBadge } from './Badge'
import { useAddProject } from './AddProject'
import { Button } from './Button'
import { DemoMenu } from './DemoMenu'
import { EmptyState } from './EmptyState'
import { Icon } from './Icon'

type Props = {
  /** True when the sidebar sits on top of the page (small screens). */
  isPanel: boolean
  onNavigate: () => void
}

type Section = { title: string; reviews: Review[] }

/** Features still in review come first. Approved ones sit in their own group. Empty groups are left out. */
function sections(reviews: Review[]): Section[] {
  const list: Section[] = [
    { title: 'In progress', reviews: reviews.filter((r) => r.stage !== 'approved') },
    { title: 'Approved', reviews: reviews.filter((r) => r.stage === 'approved') },
  ]
  return list.filter((g) => g.reviews.length > 0)
}

/** Projects and their features, like a file list. Also holds the demo controls. */
export const LeftSidebar = forwardRef<HTMLElement, Props>(function LeftSidebar({ isPanel, onNavigate }, ref) {
  const { state } = useApp()
  const openAddProject = useAddProject()
  const { role, projects: allProjects } = state
  // The designer sees a project and its requests only after confirming the first request.
  const reviews = state.reviews.filter((r) => !(role === 'designer' && r.stage === 'requested'))
  const projects = allProjects.filter((p) => !(role === 'designer' && p.listed === false))
  const groups = sections(reviews)
  const addButton = (
    <Button
      variant="secondary"
      size="small"
      className="add-project"
      onClick={() => {
        onNavigate()
        openAddProject()
      }}
    >
      <Icon name="plus" size={16} />
      Add project
    </Button>
  )
  const activeId = useMatch('/review/:id/*')?.params.id

  return (
    <nav
      ref={ref}
      id="left-sidebar"
      aria-label="Projects"
      className={`sidebar sidebar-left ${isPanel ? 'sidebar-panel' : ''}`.trim()}
      role={isPanel ? 'dialog' : undefined}
      aria-modal={isPanel ? true : undefined}
    >
      <div className="sidebar-head">
        <h2 className="sidebar-title">Projects</h2>
      </div>

      <div className="sidebar-body">
        {projects.length > 0 ? addButton : null}

        {projects.length === 0 ? (
          <EmptyState title="No projects yet">{addButton}</EmptyState>
        ) : groups.length === 0 ? (
          <ul className="tree">
            {projects.map((project) => (
              <ProjectGroup key={project.id} project={project} reviews={[]} activeId={activeId} onNavigate={onNavigate} />
            ))}
          </ul>
        ) : (
          groups.map((group, groupIndex) => (
            <section key={group.title} className="sidebar-section">
              {group.title === 'In progress' ? null : <h3 className="sidebar-section-title">{group.title}</h3>}
              <ul className="tree">
                {projects
                  .filter((p) => group.reviews.some((r) => r.projectId === p.id))
                  .map((project) => (
                    <ProjectGroup
                      key={project.id}
                      project={project}
                      reviews={sortReviews(
                        group.reviews.filter((r) => r.projectId === project.id),
                        role,
                      )}
                      activeId={activeId}
                      onNavigate={onNavigate}
                      others={role === 'developer' && groupIndex === 0 && project.id === projects[0]?.id ? DEMO_OTHER_BRANCHES : []}
                    />
                  ))}
              </ul>
            </section>
          ))
        )}
      </div>

      <div className="sidebar-foot">
        <DemoMenu />
      </div>
    </nav>
  )
})

type GroupProps = {
  project: Project
  reviews: Review[]
  activeId: string | undefined
  onNavigate: () => void
  /** Other branches of the project. They have no design review. */
  others?: typeof DEMO_OTHER_BRANCHES
}

function ProjectGroup({ project, reviews, activeId, onNavigate, others = [] }: GroupProps) {
  return (
    <li>
      <div className="tree-row tree-group">
        <Icon name="folder" size={16} />
        <span className="tree-name">{project.name}</span>
      </div>
      <ul className="tree-children">
        {reviews.length === 0 ? (
          <li className="tree-empty">No reviews yet.</li>
        ) : (
          reviews.map((review) => {
            const selected = review.id === activeId
            const done = review.stage === 'approved'
            return (
              <li key={review.id}>
                <Link
                  to={reviewPath(review)}
                  aria-current={selected ? 'page' : undefined}
                  className={`tree-row tree-item ${selected ? 'tree-selected' : ''} ${done ? 'tree-quiet' : ''}`.trim()}
                  onClick={onNavigate}
                >
                  <span className="tree-name">{review.branch}</span>
                  <PhaseBadge review={review} />
                  {done ? <ReleaseBadge release={review.release} /> : null}
                </Link>
              </li>
            )
          })
        )}
        {others.map((branch) => (
          <li key={branch.name}>
            <div className="tree-row tree-item tree-quiet">
              <span className="tree-name">{branch.name}</span>
              <ReleaseBadge release={branch.release} />
            </div>
          </li>
        ))}
      </ul>
    </li>
  )
}
