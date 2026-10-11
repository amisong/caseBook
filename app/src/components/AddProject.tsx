import { createContext, useCallback, useContext, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { PEOPLE } from '../lib/data'
import { parseRepoAddress } from '../lib/repoAddress'
import { useApp } from '../lib/store'
import { Button } from './Button'
import { Dialog } from './Dialog'
import { TextInput } from './TextInput'
import { useToast } from './Toast'

const BAD_ADDRESS = 'We cannot open this address. Check the link, or connect your account.'
const REQUEST_DELAY_MS = 2500

const AddProjectContext = createContext<() => void>(() => {})

/** Call the returned function to open the Add project dialog from anywhere. */
export function useAddProject() {
  return useContext(AddProjectContext)
}

/** Holds the Add project dialog. Every "Add project" button opens this one dialog. */
export function AddProjectProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { state, dispatch } = useApp()
  const showToast = useToast()

  const openDialog = useCallback(() => {
    setAddress('')
    setError('')
    setWorking(false)
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (working) return

    if (!address.trim()) {
      setError('Paste a code address first.')
      inputRef.current?.focus()
      return
    }

    const parsed = parseRepoAddress(address)
    if (!parsed.ok) {
      setError(BAD_ADDRESS)
      inputRef.current?.focus()
      return
    }

    const projectId = `${parsed.host}/${parsed.owner}/${parsed.name}`
    if (state.projects.some((p) => p.id === projectId)) {
      setError('This project is already added.')
      inputRef.current?.focus()
      return
    }

    setError('')
    setWorking(true)

    // Demo only: wait a moment, as if the code was being opened.
    window.setTimeout(() => {
      dispatch({ type: 'addProject', project: { id: projectId, name: parsed.name, url: parsed.url, listed: false } })
      setWorking(false)
      setOpen(false)
      showToast('Code address saved')

      // Demo only: a developer sends a design QA request a few seconds later.
      window.setTimeout(() => {
        dispatch({
          type: 'createReview',
          projectId,
          name: 'Cart page',
          requestedBy: PEOPLE.developer.name,
          note: 'Cart changes by state and A/B test.',
          branch: 'feature/cart-page',
          reviewers: [PEOPLE.designer.name],
        })
      }, REQUEST_DELAY_MS)
    }, 900)
  }

  const value = useMemo(() => openDialog, [openDialog])

  return (
    <AddProjectContext.Provider value={value}>
      {children}
      <Dialog open={open} title="Add project" onClose={working ? () => {} : close}>
        <p className="dialog-text">To add a project, you need the link to your team&apos;s code.</p>
        <p className="dialog-quote">Ask a developer: &quot;Can you send me the GitHub or GitLab link for our project?&quot;</p>
        <form className="dialog-form" onSubmit={onSubmit} noValidate>
          <TextInput
            ref={inputRef}
            label="Enter the code address (from GitHub or GitLab)"
            placeholder="https://github.com/your-team/your-app"
            value={address}
            disabled={working}
            error={error}
            autoComplete="off"
            spellCheck={false}
            inputMode="url"
            onChange={(e) => {
              setAddress(e.target.value)
              if (error) setError('')
            }}
          />
          <div className="dialog-actions">
            <Button type="button" variant="ghost" onClick={close} disabled={working}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={working}>
              {working ? 'Opening the code' : 'Start'}
            </Button>
          </div>
        </form>
      </Dialog>
    </AddProjectContext.Provider>
  )
}
