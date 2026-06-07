import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bell, MessageCircle, User, AlertTriangle, Shield } from 'lucide-react'

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
              <div className="group relative">
                <div className="flex items-center gap-3 cursor-pointer">
                  <img 
                    src="https://i.pravatar.cc/150?img=5" 
                    alt="Sarah Johnson" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="hidden md:block">
                    <h1 className="text-sm font-bold text-slate-900 leading-tight tracking-tight">Sarah Johnson</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="bg-[#1e7b2b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Shield className="w-3 h-3" /> Verified
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">Trust Score: 4.8/5</span>
                    </div>
                  </div>
                </div>
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
