import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'default' | 'small'
  /** Shows a spinner and blocks clicks. The label stays so the width does not change. */
  loading?: boolean
  icon?: IconName
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button({
  variant = 'secondary',
  size = 'default',
  loading = false,
  icon,
  className = '',
  children,
  onClick,
  type = 'button',
  ...rest
}, ref) {
  const classes = ['btn', `btn-${variant}`, size === 'small' ? 'btn-small' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      onClick={loading ? (e) => e.preventDefault() : onClick}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : icon ? <Icon name={icon} size={size === 'small' ? 16 : 18} /> : null}
      {children}
    </button>
  )
})
