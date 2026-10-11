import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'

export function NotFoundPage() {
  return (
    <div className="start">
      <EmptyState icon="alert" title="We cannot find this page" text="The link may be old or mistyped.">
        <Link to="/" className="btn btn-primary empty-action">
          Go to start
        </Link>
      </EmptyState>
    </div>
  )
}
