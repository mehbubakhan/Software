import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar(){
  const { user, logout } = useAuth() || {}
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-yellow-300" />
        <Link to="/" className="font-bold text-lg">Daycare</Link>
      </div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.name || user.email}</span>
            <button onClick={logout} className="px-3 py-1 bg-red-400 text-white rounded">Logout</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-accent">Login</Link>
            <Link to="/signup" className="ml-2 text-accent">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
