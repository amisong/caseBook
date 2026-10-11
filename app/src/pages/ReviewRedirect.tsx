import { Navigate, useParams } from 'react-router-dom'
import { reviewPath } from '../lib/selectors'
import { useReview } from '../lib/store'
import { NotFoundPage } from './NotFoundPage'

/** /review/:id goes to the right step: confirm first, then the cases. */
export function ReviewRedirect() {
  const { id } = useParams()
  const review = useReview(id)
  if (!review) return <NotFoundPage />
  return <Navigate to={reviewPath(review)} replace />
}
