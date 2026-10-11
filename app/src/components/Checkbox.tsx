import { useId } from 'react'

type Props = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
}

/** A real checkbox in a 44px row (design system 4.4). */
export function Checkbox({ label, checked, onChange, hint }: Props) {
  const id = useId()
  return (
    <label className="check-row" htmlFor={id}>
      <input id={id} type="checkbox" className="check" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {label}
        {hint ? <span className="check-hint"> {hint}</span> : null}
      </span>
    </label>
  )
}
