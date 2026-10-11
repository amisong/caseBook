import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  icon: IconName
  /** Required. An icon alone needs a name. */
  label: string
}

/** A 44px tap area with one icon. Uses the ghost button states. */
export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { icon, label, className = '', type = 'button', ...rest },
  ref,
) {
  return (
    <button {...rest} ref={ref} type={type} className={`icon-btn ${className}`.trim()} aria-label={label} title={label}>
      <Icon name={icon} />
    </button>
  )
})
