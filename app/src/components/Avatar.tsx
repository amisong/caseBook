import type { Role } from '../lib/types'

/** The face for each person in the demo. Emma is the designer. Tom is the developer. */
export function Avatar({ role }: { role: Role }) {
  const file = role === 'designer' ? 'emma' : 'tom'
  return <img src={`/avatars/${file}.jpg`} alt="" className="avatar" />
}
