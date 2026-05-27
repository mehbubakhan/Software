import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bell, MessageCircle, User } from 'lucide-react'

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
          {/* Empty for now */}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-5">
              <button className="text-slate-500 hover:text-fuchsia-600 transition relative">
                <MessageCircle className="h-6 w-6" />
              </button>
              <button className="text-slate-500 hover:text-fuchsia-600 transition relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
              </button>
              <div className="group relative">
                <button className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-100 text-slate-500 hover:border-fuchsia-600 transition">
                  <User className="h-5 w-5" />
                </button>
                {/* Dropdown Menu (Hidden by default, shown on hover for profile actions) */}
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 bg-white shadow-lg opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible z-50">
                  <div className="p-2">
                    <button className="block w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-fuchsia-600 rounded-lg transition">Manage Profile</button>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition">Log out</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-fuchsia-600 transition">Log in</Link>
              <Link to="/signup" className="rounded-full bg-fuchsia-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-fuchsia-700">Sign up</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}
