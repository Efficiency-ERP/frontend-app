import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/styles/index.css'
import Router from './routes/routing.tsx'
import { NavigationProvider } from './context/NavigationContext'
import UserProvider from './context/UserContext'
// Favicon is served from /public/icon.svg via index.html

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavigationProvider>
      <UserProvider>
        <Router />
      </UserProvider>
    </NavigationProvider>
  </StrictMode>,
)
