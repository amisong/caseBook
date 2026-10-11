import type { ReviewStatus } from '../lib/types'
import { Icon } from './Icon'

type Props = {
  number: number
  status: ReviewStatus
  small?: boolean
}

/** The round marker. Color follows the status of the comment (design system 4.20). */
export function PinMark({ number, status, small = false }: Props) {
  return (
    <span className={`pin-mark pin-${status} ${small ? 'pin-mark-small' : ''}`.trim()} aria-hidden="true">
      {status === 'approved' ? <Icon name="check" size={small ? 14 : 16} /> : number}
    </span>
  )
}
