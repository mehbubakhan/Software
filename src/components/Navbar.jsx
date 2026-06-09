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
              
              {/* Notifications Dropdown */}
              <div className="group relative">
                <button className="relative p-2 text-slate-500 hover:text-fuchsia-600 transition rounded-full hover:bg-slate-50">
                  <Bell className="w-5 h-5" />
                  {user?.role === 'admin' && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
                    </span>
                  )}
                </button>
                
                {/* Dropdown Content */}
                <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-xl opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-[#f8fafc] flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Notifications</h3>
                    <span className="text-xs font-bold text-fuchsia-600 cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {user?.role === 'admin' ? (
                      <>
                        <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                          <p className="text-xs text-red-600 font-black mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> SOS ALERT</p>
                          <p className="text-sm font-bold text-slate-900">Nanny Mary triggered an emergency.</p>
                          <p className="text-xs text-slate-500 mt-1 font-medium">2 minutes ago</p>
                        </div>
                        <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                          <p className="text-xs text-amber-600 font-black mb-1 flex items-center gap-1"><Shield className="w-3 h-3"/> APPROVAL REQUIRED</p>
                          <p className="text-sm font-bold text-slate-900">Daycare "Sunshine Academy" submitted documents.</p>
                          <p className="text-xs text-slate-500 mt-1 font-medium">1 hour ago</p>
                        </div>
                        <div className="p-4 hover:bg-slate-50 transition cursor-pointer">
                          <p className="text-xs text-blue-600 font-black mb-1 flex items-center gap-1"><User className="w-3 h-3"/> NEW REGISTRATION</p>
                          <p className="text-sm font-bold text-slate-900">Parent John Doe is awaiting ID verification.</p>
                          <p className="text-xs text-slate-500 mt-1 font-medium">3 hours ago</p>
                        </div>
                      </>
                    ) : (
                      <div className="p-6 text-center text-sm font-bold text-slate-500">
                        No new notifications.
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-slate-100 text-center bg-[#f8fafc]">
                    <button className="text-xs font-black text-slate-500 hover:text-fuchsia-600 transition uppercase tracking-wider">View All</button>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="flex items-center gap-3 cursor-pointer pl-3 border-l border-slate-200">
                  <img 
                    src={user?.role === 'admin' ? "https://i.pravatar.cc/150?img=11" : "https://i.pravatar.cc/150?img=5"} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="hidden md:block">
                    <h1 className="text-sm font-bold text-slate-900 leading-tight tracking-tight">{user?.name || 'Sarah Johnson'}</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm ${user?.role === 'admin' ? 'bg-fuchsia-600' : 'bg-[#1e7b2b]'}`}>
                        <Shield className="w-3 h-3" /> {user?.role === 'admin' ? 'Super Admin' : 'Verified'}
                      </span>
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
