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
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-500">
          <Link to="/dashboard/parent" className="hover:text-fuchsia-600 transition">Dashboard</Link>
          <Link to="/learning" className="text-fuchsia-600">Learning</Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard/child')}
            className="flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-4 py-1.5 text-xs font-bold text-fuchsia-600 hover:bg-fuchsia-100 transition"
          >
            <span>👧</span> Child Mode
          </button>
          
          <button className="text-slate-400 hover:text-fuchsia-600 transition relative">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] text-white"></span>
          </button>
          
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
