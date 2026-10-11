import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { CasePage } from './pages/CasePage'
import { ConfirmPage } from './pages/ConfirmPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RequestPage } from './pages/RequestPage'
import { ReviewRedirect } from './pages/ReviewRedirect'
import { OnboardingPage } from './pages/OnboardingPage'

/**
 * One URL per page. Every page sits inside the app shell.
 * To add a page: create a file in src/pages, then add a line below.
 * `handle.title` is the name shown in the header and the browser tab.
 */
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <OnboardingPage /> },
      { path: '/requests/new', element: <RequestPage />, handle: { title: 'Request design QA' } },
      { path: '/review/:id', element: <ReviewRedirect />, handle: { title: 'Review' } },
      { path: '/review/:id/confirm', element: <ConfirmPage /> },
      { path: '/review/:id/cases/:caseId', element: <CasePage />, handle: { title: 'Case' } },
      { path: '*', element: <NotFoundPage />, handle: { title: 'Page not found' } },
    ],
  },
])
