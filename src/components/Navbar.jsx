import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bell, MessageCircle, User, AlertTriangle, Shield } from 'lucide-react'
import NotificationCenter from './NotificationCenter'

export default function Navbar(){
  const { user, logout } = useAuth() || {}
  const navigate = useNavigate()
  const [photo, setPhoto] = useState(localStorage.getItem('profilePhoto') || (user?.role === 'admin' ? "https://i.pravatar.cc/150?img=11" : "https://i.pravatar.cc/150?img=5"))

  useEffect(() => {
    const handlePhotoChange = () => {
      setPhoto(localStorage.getItem('profilePhoto') || (user?.role === 'admin' ? "https://i.pravatar.cc/150?img=11" : "https://i.pravatar.cc/150?img=5"));
    };
    window.addEventListener('profilePhotoUpdated', handlePhotoChange);
    return () => window.removeEventListener('profilePhotoUpdated', handlePhotoChange);
  }, [user]);

  return (
    <nav className="sticky top-0 z-30 border-b border-white/70 bg-white/75 px-4 py-3 shadow-sm shadow-fuchsia-900/5 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to={user ? "/role-redirect" : "/"} className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-600 text-lg font-black text-white shadow-lg shadow-fuchsia-500/20 group-hover:bg-fuchsia-700 transition">
            M
          </div>
          <span className="text-xl font-black text-slate-950 transition group-hover:text-fuchsia-700">Minimate</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-500">
          {/* Empty for now */}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-5">
              
              {/* Messages Link */}
              <Link to="/dashboard/messages" className="relative p-2 text-slate-500 hover:text-fuchsia-600 transition rounded-full hover:bg-slate-50">
                <MessageCircle className="w-5 h-5" />
              </Link>

              {/* Notifications Dropdown */}
              <NotificationCenter />

              <div className="group relative">
                <div className="flex items-center gap-3 cursor-pointer pl-3 border-l border-slate-200">
                  <img 
                    src={photo} 
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
