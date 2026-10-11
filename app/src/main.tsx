import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AddProjectProvider } from './components/AddProject'
import { ToastProvider } from './components/Toast'
import { StoreProvider } from './lib/store'
import { router } from './router'
import '@fontsource-variable/inter'
import '@fontsource-variable/archivo'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <ToastProvider>
        <AddProjectProvider>
          <RouterProvider router={router} />
        </AddProjectProvider>
      </ToastProvider>
    </StoreProvider>
  </StrictMode>,
)
