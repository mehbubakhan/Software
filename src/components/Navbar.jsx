import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar(){
  const { user, logout } = useAuth() || {}
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-30 border-b border-white/70 bg-white/75 px-4 py-3 shadow-sm shadow-fuchsia-900/5 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-600 text-lg font-black text-white shadow-lg shadow-fuchsia-500/20">
            M
          </div>
          <Link to="/" className="text-xl font-black text-slate-950 transition hover:text-fuchsia-700">Minimate</Link>
        </div>
        

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          <button className="text-slate-400 hover:text-slate-600 transition">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </button>

          {user && (
            <button onClick={logout} className="text-lg font-bold text-slate-400 hover:text-slate-600 transition">
              Logout
            </button>
          )}
        </div>

      </div>
    </nav>
  )
}
