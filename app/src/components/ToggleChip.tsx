import { Icon } from './Icon'

type Props = {
  label: string
  on: boolean
  onToggle: () => void
}

/** A pill that is on or off. Several chips sit together, and each is chosen on its own. */
export function ToggleChip({ label, on, onToggle }: Props) {
  return (
    <button type="button" className={`chip ${on ? 'chip-on' : ''}`.trim()} aria-pressed={on} onClick={onToggle}>
      {on ? <Icon name="check" size={16} /> : null}
      {label}
    </button>
  )
}
