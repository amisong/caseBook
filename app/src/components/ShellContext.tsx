import { createContext, useContext, useEffect } from 'react'

export type RightInfo = { count: number; label: string }

type ShellValue = {
  /** Where a page puts its main button (top right of the header). */
  headerActionsEl: HTMLElement | null
  /** Where a page puts the content of the right sidebar. Only exists while the sidebar is open. */
  rightEl: HTMLElement | null
  /** A page tells the shell that it has a right sidebar. Pass null when the page goes away. */
  registerRight: (info: RightInfo | null) => void
  /** On small screens the sidebar sits on top. Pages close it after an action that needs the design. */
  closeRightPanel: () => void
  /** A page can replace the route title, for example with the feature name. */
  setTitle: (title: string | null) => void
}

export const ShellContext = createContext<ShellValue>({
  headerActionsEl: null,
  rightEl: null,
  registerRight: () => {},
  closeRightPanel: () => {},
  setTitle: () => {},
})

export function useShell() {
  return useContext(ShellContext)
}

/** Register the right sidebar for as long as the page is shown. */
export function useRightSidebar(count: number, label: string) {
  const { registerRight } = useShell()
  useEffect(() => {
    registerRight({ count, label })
    return () => registerRight(null)
  }, [registerRight, count, label])
}

/** Show this text as the page title in the header and the browser tab. */
export function usePageTitle(title: string) {
  const { setTitle } = useShell()
  useEffect(() => {
    setTitle(title)
    return () => setTitle(null)
  }, [setTitle, title])
}
