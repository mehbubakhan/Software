import React, { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ items = [], variant = 'default' }){
  const navigate = useNavigate()
  const [activeHash, setActiveHash] = useState(() => {
    if (typeof window === 'undefined') return ''
    return window.location.hash || ''
  })
  
  const { isChildMode, toggleChildMode } = useAuth() || {}
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState('')

  const handlePinSubmit = () => {
    if (pin === '1234') { // Hardcoded prototype PIN
      toggleChildMode(false)
      setShowPinModal(false)
      setPin('')
    } else {
      alert('Incorrect PIN')
      setPin('')
    }
  }

  React.useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash || '')
    window.addEventListener('hashchange', updateHash)
    return () => window.removeEventListener('hashchange', updateHash)
  }, [])

const renderIcon = (iconName) => {
    switch (iconName) {
      case 'svg-dashboard': return <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>;
      case 'svg-nanny': return <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
      case 'svg-daycare': return <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>;
      case 'svg-adoption': return <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
      case 'svg-shop': return <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
      case 'svg-job-requests': return <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>;
      case 'svg-interviews': return <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
      case 'svg-schedule': return <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
      case 'svg-messages': return <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>;
      case 'svg-notifications': return <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
      case 'svg-settings': return <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
      default: return <span className="text-lg opacity-80">▹</span>;
    }
  }

  if (variant === 'parent-workspace') {
    return (
      <aside className="flex flex-col w-full bg-[#0F111A] border-b border-[#1A1D27] md:min-h-[calc(100vh-68px)] md:w-[280px] md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 p-6 pb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-fuchsia-600 text-sm font-bold text-white">M</div>
          <div>
            <h1 className="font-bold text-white">Minimate</h1>
            <p className="text-xs text-slate-400">Parent Portal</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="flex gap-2 overflow-x-auto pb-1 md:block md:space-y-1 md:overflow-visible md:pb-0">
            {items.map(i => (
              <li key={i.path} className="shrink-0 md:shrink">
                <NavLink
                  to={i.path}
                  end={i.path === '/dashboard/parent'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 focus:outline-none ${
                      isActive ? 'bg-[#7c3aed] text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`
                  }
                >
                  {renderIcon(i.icon)}
                  {i.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-6 pt-2">
          <button 
            onClick={() => navigate('/dashboard/child')}
            className="w-full rounded-xl bg-fuchsia-600 py-3 font-bold text-white transition hover:bg-fuchsia-500 shadow-[0_0_15px_rgba(192,38,211,0.4)]"
          >
            Child mode
          </button>
        </div>

        {showPinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1A1D27] border border-[#2A2E3D] p-8 rounded-3xl w-full max-w-sm text-center">
              <h2 className="text-xl font-bold text-white mb-2">Parent Verification</h2>
              <p className="text-sm text-slate-400 mb-6">Enter PIN to exit Child Mode</p>
              
              <input 
                type="password" 
                maxLength="4"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center text-2xl tracking-widest bg-[#0B0E14] border border-[#2A2E3D] rounded-xl p-4 text-white focus:outline-none focus:border-fuchsia-500 mb-4"
                placeholder="****"
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={() => { setShowPinModal(false); setPin(''); }}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePinSubmit}
                  className="flex-1 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl transition"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    )
  }

  if (variant === 'adoption-workspace') {
    return (
      <aside className="flex flex-col h-full transition-all duration-300 bg-slate-900 border-r border-slate-800 shrink-0 md:min-h-[calc(100vh-68px)] md:w-[260px] md:border-b-0 md:border-r">
        <div className="flex items-center h-16 px-4 gap-3 border-b border-slate-800">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-600 flex-shrink-0 shadow-lg shadow-cyan-500/20">
            <span className="text-white font-bold text-sm">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-extrabold text-white truncate">SmartNanny</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate">Adoption</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <ul className="flex flex-col gap-1 md:block md:space-y-1">
            {items.map(i => {
              const hash = i.path.includes('#') ? `#${i.path.split('#')[1]}` : ''
              const active = hash ? activeHash === hash : activeHash === ''
              return (
                <li key={i.path} className="shrink-0 md:shrink w-full">
                  <Link
                    to={i.path}
                    onClick={() => {
                      if (hash) {
                        setTimeout(() => {
                          document.getElementById(hash.substring(1))?.scrollIntoView({ behavior: 'smooth' })
                        }, 50)
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all relative group text-left text-sm font-bold ${
                      active
                        ? 'bg-slate-800 text-white border-l-4 border-cyan-500'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
                    }`}
                  >
                    {renderIcon(i.icon)}
                    <span className="truncate">{i.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    )
  }

  if (variant === 'marketplace-workspace') {
    return (
      <aside className="flex flex-col h-full transition-all duration-300 bg-slate-900 border-r border-slate-800 shrink-0 md:min-h-[calc(100vh-68px)] md:w-[260px] md:border-b-0 md:border-r">
        <div className="flex items-center h-16 px-4 gap-3 border-b border-slate-800">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500 flex-shrink-0 shadow-lg shadow-amber-500/20">
            <span className="text-white font-bold text-sm">MP</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-extrabold text-white truncate">SmartNanny</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate">Marketplace</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <ul className="flex flex-col gap-1 md:block md:space-y-1">
            {items.map(i => {
              const hash = i.path.includes('#') ? `#${i.path.split('#')[1]}` : ''
              const active = hash ? activeHash === hash : activeHash === ''
              return (
                <li key={i.path} className="shrink-0 md:shrink w-full">
                  <Link
                    to={i.path}
                    onClick={() => {
                      if (hash) {
                        setTimeout(() => {
                          document.getElementById(hash.substring(1))?.scrollIntoView({ behavior: 'smooth' })
                        }, 50)
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all relative group text-left text-sm font-bold ${
                      active
                        ? 'bg-slate-800 text-white border-l-4 border-amber-500'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
                    }`}
                  >
                    {renderIcon(i.icon)}
                    <span className="truncate">{i.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    )
  }

  if (variant === 'daycare-workspace') {
    return (
      <aside className="flex flex-col h-full transition-all duration-300 bg-slate-900 border-r border-slate-800 shrink-0 md:min-h-[calc(100vh-68px)] md:w-[260px] md:border-b-0 md:border-r">
        <div className="flex items-center h-16 px-4 gap-3 border-b border-slate-800">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-600 flex-shrink-0 shadow-lg shadow-purple-500/20">
            <span className="text-white font-bold text-sm">DC</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-extrabold text-white truncate">SmartNanny</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate">DaycareHub</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <ul className="flex flex-col gap-1 md:block md:space-y-1">
            {items.map(i => (
              <li key={i.path} className="shrink-0 md:shrink w-full">
                <NavLink
                  to={i.path}
                  end={i.path === '/dashboard/daycare'}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-2.5 transition-all relative group text-left text-sm font-bold ${
                      isActive ? 'bg-slate-800 text-white border-l-4 border-purple-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
                    }`
                  }
                >
                  {renderIcon(i.icon)}
                  <span className="truncate">{i.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 px-4 py-2 w-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-full border-b border-white/70 bg-white/65 p-4 backdrop-blur-xl md:min-h-[calc(100vh-68px)] md:w-64 md:border-b-0 md:border-r">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-fuchsia-500">Workspace</p>
      <ul className="flex gap-2 overflow-x-auto md:block md:space-y-2">
        {items.map(i => (
          <li key={i.path} className="shrink-0 md:shrink">
            <NavLink
              to={i.path}
              end={i.path.endsWith('/nanny') || i.path.endsWith('/parent') || i.path.endsWith('/admin')}
              className={({ isActive }) =>
                `block rounded-lg border px-4 py-3 text-sm font-bold transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white hover:text-cyan-700 hover:shadow-md ${
                  isActive ? 'border-cyan-200 bg-white text-cyan-700 shadow-sm' : 'border-transparent text-slate-700'
                }`
              }
            >
              {i.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}
