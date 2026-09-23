import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SiteProvider } from './site/SiteContext.jsx'

// /admin → CMS (tải riêng, không làm nặng trang chính); mọi đường dẫn khác → website
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))
const isAdmin = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ) : (
      <SiteProvider>
        <App />
      </SiteProvider>
    )}
  </StrictMode>,
)
