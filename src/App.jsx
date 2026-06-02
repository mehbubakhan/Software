import React from 'react'
import { useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import AppRoutes from './routes/Routes'
import { useAuth } from './context/AuthContext'

function Shell(){
  const { user } = useAuth() || {}
  const location = useLocation()
  
  // Hide navbar on welcome, login, and signup pages
  const isAuthPage = location.pathname === '/' || location.pathname.startsWith('/login') || location.pathname.startsWith('/signup');
  const showNavbar = !isAuthPage;

  return (
    <div className="min-h-screen bg-auth-splash text-slate-900">
      {showNavbar ? <Navbar /> : null}
      <AppRoutes />
    </div>
  )
}

function App(){
  return (
    <ToastProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
