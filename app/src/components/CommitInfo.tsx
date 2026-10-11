import { useRef, useState } from 'react'
import { commitsFor, type DemoCommit } from '../lib/data'
import { Icon } from './Icon'
import { Popover } from './Popover'

/** "Asked by Tom" as a button. It opens the commits on the branch, in a form developers know. */
export function CommitInfo({ name, branch, revision }: { name: string; branch: string; revision: number }) {
  const [open, setOpen] = useState(false)
  const [openHash, setOpenHash] = useState<string | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [latest, ...earlier] = commitsFor(revision)

  return (
    <span className="commit-anchor">
      <button ref={triggerRef} type="button" className="commit-trigger" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <Icon name="message" size={16} />
        Asked by {name}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} label="Commits" width={440}>
        <div className="commit">
          <div className="commit-top">
            <span className="commit-label">{earlier.length + 1} commits</span>
            <code className="commit-branch">{branch}</code>
          </div>

          <div className="commit-block">
            <p className="commit-tag">Latest</p>
            <CommitLog commit={latest} name={name} />
          </div>

          <ul className="commit-earlier" aria-label="Earlier commits">
            {earlier.map((c) => {
              const isOpen = openHash === c.hash
              return (
                <li key={c.hash}>
                  <button type="button" className="commit-row" aria-expanded={isOpen} onClick={() => setOpenHash(isOpen ? null : c.hash)}>
                    <Icon name={isOpen ? 'chevronDown' : 'chevronRight'} size={14} />
                    <code className="commit-hash">{c.hash}</code>
                    <span className="commit-subject">{c.subject}</span>
                  </button>
                  {isOpen ? <CommitLog commit={c} name={name} /> : null}
                </li>
              )
            })}
          </ul>
        </div>
      </Popover>
    </span>
  )
}

function CommitLog({ commit, name }: { commit: DemoCommit; name: string }) {
  return (
    <pre className="commit-log">
      <span className="commit-dim">commit {commit.hash}</span>
      {'\n'}
      <span className="commit-dim">Author: {name}</span>
      {'\n'}
      <span className="commit-dim">Date:   {commit.time}</span>
      {'\n\n'}
      <strong>{commit.subject}</strong>
      {'\n\n'}
      {commit.body.map((line) => `- ${line}`).join('\n')}
    </pre>
  )
}
