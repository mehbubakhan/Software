import React from 'react'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import AppRoutes from './routes/Routes'

function App(){
  return (
    <AuthProvider>
      <div className="min-h-screen bg-daycare">
        <Navbar />
        <AppRoutes />
      </div>
    </AuthProvider>
  )
}

export default App
