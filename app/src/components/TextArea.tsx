import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  label: string
  /** Hides the label on screen. It is still read aloud. */
  hideLabel?: boolean
  error?: string
  /** Shows a count under the field from this length on. */
  countFrom?: number
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { label, hideLabel, error, countFrom, maxLength, value, className = '', ...rest },
  ref,
) {
  const id = useId()
  const errorId = `${id}-error`
  const length = typeof value === 'string' ? value.length : 0
  return (
    <div className="field">
      <label className={hideLabel ? 'visually-hidden' : 'field-label'} htmlFor={id}>
        {label}
      </label>
      <textarea
        {...rest}
        ref={ref}
        id={id}
        value={value}
        maxLength={maxLength}
        className={`input textarea ${error ? 'input-error' : ''} ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error ? (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      ) : null}
      {countFrom !== undefined && maxLength && length >= countFrom ? (
        <p className="field-count">
          {length} / {maxLength}
        </p>
      ) : null}
    </div>
  )
})
