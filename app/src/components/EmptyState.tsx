import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

type Props = {
  icon?: IconName
  title: string
  text?: string
  children?: ReactNode
}

export function EmptyState({ icon = 'folder', title, text, children }: Props) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon name={icon} size={22} />
      </span>
      <p className="empty-title">{title}</p>
      {text ? <p className="empty-text">{text}</p> : null}
      {children}
    </div>
  )
}
