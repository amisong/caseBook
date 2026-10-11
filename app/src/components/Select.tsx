import { useId, type ReactNode, type SelectHTMLAttributes } from 'react'

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

/** A dropdown field. It uses the browser's own list so it works with keyboard and screen readers. */
export function Select({ label, hint, error, children, ...rest }: Props) {
  const id = useId()
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <select {...rest} id={id} className={`input select ${error ? 'input-error' : ''}`.trim()} aria-invalid={error ? true : undefined}>
        {children}
      </select>
      {hint && !error ? <p className="field-hint">{hint}</p> : null}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  )
}
