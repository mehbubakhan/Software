import React from 'react'
import { useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import AppRoutes from './routes/Routes'
import { useAuth } from './context/AuthContext'

function Shell(){
  const { user } = useAuth() || {}
  const location = useLocation()
  const showNavbar = user || location.pathname !== '/'

  return (
    <div className="min-h-screen bg-auth-splash text-slate-900">
      {showNavbar ? <Navbar /> : null}
      <AppRoutes />
    </div>
  )
}

function App(){
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}

export default App
