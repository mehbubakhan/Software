import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar(){
  const { user, logout } = useAuth() || {}
  return (
    <nav className="sticky top-0 z-30 border-b border-white/70 bg-white/75 px-4 py-3 shadow-sm shadow-cyan-900/5 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 text-lg font-black text-white shadow-lg shadow-blue-500/20">
          D
        </div>
        <Link to="/" className="text-lg font-black text-slate-950 transition hover:text-cyan-700">Daycare</Link>
      </div>
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-cyan-50 px-3 py-2 text-sm font-semibold text-slate-700 sm:inline-flex">{user.name || user.email}</span>
            <button onClick={logout} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-fuchsia-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-fuchsia-100">Logout</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700">Login</Link>
            <Link to="/signup" className="rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-fuchsia-500/25">Signup</Link>
          </div>
        )}
      </div>
      </div>
    </nav>
  )
}
