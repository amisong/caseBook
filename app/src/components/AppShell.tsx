import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Outlet, useMatches } from 'react-router-dom'
import { APP_NAME } from '../config'
import { readStored, writeStored } from '../lib/storage'
import { useMediaQuery } from '../lib/useMediaQuery'
import { IconButton } from './IconButton'
import { LeftSidebar } from './LeftSidebar'
import { NotificationBell } from './NotificationBell'
import { ShellContext, type RightInfo } from './ShellContext'

type RouteHandle = { title?: string }

const LEFT_KEY = 'casebook.leftSidebarOpen'
const RIGHT_KEY = 'casebook.rightSidebarOpen.v2'

/**
 * The frame around every page: header, left sidebar, the page, and an optional right sidebar.
 * Rules are in docs/design-system.md, section 4.17.
 */
export function AppShell() {
  const isWide = useMediaQuery('(min-width: 900px)')

  // Wide screens: open or closed as the person left it. Smaller screens: closed at first.
  const [wideLeft, setWideLeft] = useState(() => readStored<boolean>(LEFT_KEY, true))
  const [wideRight, setWideRight] = useState(() => readStored<boolean>(RIGHT_KEY, false))
  const [panelLeft, setPanelLeft] = useState(false)
  const [panelRight, setPanelRight] = useState(false)

  const [rightInfo, setRightInfo] = useState<RightInfo | null>(null)
  const [headerActionsEl, setHeaderActionsEl] = useState<HTMLElement | null>(null)
  const [rightEl, setRightEl] = useState<HTMLElement | null>(null)
  const [titleOverride, setTitleOverride] = useState<string | null>(null)

  const leftOpen = isWide ? wideLeft : panelLeft
  const rightOpen = rightInfo !== null && (isWide ? wideRight : panelRight)

  const leftToggleRef = useRef<HTMLButtonElement>(null)
  const rightToggleRef = useRef<HTMLButtonElement>(null)
  const leftRef = useRef<HTMLElement>(null)

  const matches = useMatches()
  const routeTitle = [...matches].reverse().map((m) => (m.handle as RouteHandle | undefined)?.title).find(Boolean)
  const title = titleOverride ?? routeTitle

  useEffect(() => {
    document.title = title ? `${title} - ${APP_NAME}` : APP_NAME
  }, [title])

  const toggleLeft = () => {
    if (isWide) {
      setWideLeft((v) => {
        writeStored(LEFT_KEY, !v)
        return !v
      })
    } else {
      // Small screens: only one sidebar on top at a time.
      setPanelRight(false)
      setPanelLeft((v) => !v)
    }
  }

  const toggleRight = () => {
    if (isWide) {
      setWideRight((v) => {
        writeStored(RIGHT_KEY, !v)
        return !v
      })
    } else {
      setPanelLeft(false)
      setPanelRight((v) => !v)
    }
  }

  const closePanels = useCallback(() => {
    const wasLeft = panelLeft
    setPanelLeft(false)
    setPanelRight(false)
    ;(wasLeft ? leftToggleRef : rightToggleRef).current?.focus()
  }, [panelLeft])

  const closeRightPanel = useCallback(() => setPanelRight(false), [])
  const registerRight = useCallback((info: RightInfo | null) => setRightInfo(info), [])
  const setTitle = useCallback((value: string | null) => setTitleOverride(value), [])

  // On small screens an open sidebar sits on top: move focus in, keep it inside, close on Escape.
  const panelNode: HTMLElement | null = !isWide ? (panelLeft ? leftRef.current : panelRight ? rightEl : null) : null
  const hasPanel = !isWide && (panelLeft || (panelRight && rightInfo !== null))
  useEffect(() => {
    if (!hasPanel) return
    const node = panelNode
    node?.querySelector<HTMLElement>('a, button')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePanels()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const items = node.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select')
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // The panel node can appear one render after the panel opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPanel, panelLeft, panelRight, rightEl !== null])

  useEffect(() => {
    if (isWide) {
      setPanelLeft(false)
      setPanelRight(false)
    }
  }, [isWide])

  const value = useMemo(
    () => ({ headerActionsEl, rightEl, registerRight, closeRightPanel, setTitle }),
    [headerActionsEl, rightEl, registerRight, closeRightPanel, setTitle],
  )

  const leftIsPanel = leftOpen && !isWide
  const rightIsPanel = rightOpen && !isWide

  return (
    <ShellContext.Provider value={value}>
      <div className={`shell ${leftOpen ? '' : 'shell-left-closed'}`.trim()}>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>

        {leftOpen ? <LeftSidebar ref={leftRef} isPanel={leftIsPanel} onNavigate={() => (isWide ? undefined : closePanels())} /> : null}
        {leftIsPanel || rightIsPanel ? <div className="shell-backdrop" onClick={closePanels} aria-hidden="true" /> : null}

        <div className="shell-center">
          <header className="shell-header">
            <div className="shell-header-left">
              <IconButton
                ref={leftToggleRef}
                icon="sidebar"
                label={leftOpen ? 'Close projects' : 'Open projects'}
                aria-expanded={leftOpen}
                aria-controls="left-sidebar"
                onClick={toggleLeft}
              />
              <span className="shell-app-name">{APP_NAME}</span>
            </div>
            <div className="shell-spacer" />
            <div className="shell-header-right">
              <NotificationBell />
              {rightInfo ? (
                <div className="bell">
                  <IconButton
                    ref={rightToggleRef}
                    icon="sidebarRight"
                    label={`${rightOpen ? 'Close' : 'Open'} ${rightInfo.label}, ${rightInfo.count}`}
                    aria-expanded={rightOpen}
                    aria-controls="right-sidebar"
                    onClick={toggleRight}
                  />
                  {rightInfo.count > 0 ? (
                    <span className="count-badge" aria-hidden="true">
                      {rightInfo.count > 99 ? '99+' : rightInfo.count}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div ref={setHeaderActionsEl} className="header-actions" />
          </header>
          <main id="main" className="shell-main" tabIndex={-1}>
            <Outlet />
          </main>
        </div>

        {rightOpen && rightInfo ? (
          <aside
            ref={setRightEl}
            id="right-sidebar"
            aria-label={rightInfo.label}
            className={`sidebar sidebar-right ${rightIsPanel ? 'sidebar-panel sidebar-sheet' : ''}`.trim()}
          />
        ) : null}
      </div>
    </ShellContext.Provider>
  )
}
