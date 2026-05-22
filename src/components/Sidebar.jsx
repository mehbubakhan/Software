import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ items = [], variant = 'default' }){
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
                      isActive ? 'bg-fuchsia-600/20 text-fuchsia-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`
                  }
                >
                  <span className="text-lg opacity-80">▹</span>
                  {i.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-6 pt-2">
          {isChildMode ? (
            <button 
              onClick={() => setShowPinModal(true)}
              className="w-full rounded-xl bg-slate-800 py-3 font-bold text-white transition hover:bg-slate-700 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Exit Child Mode
            </button>
          ) : (
            <button 
              onClick={() => toggleChildMode(true)}
              className="w-full rounded-xl bg-fuchsia-600 py-3 font-bold text-white transition hover:bg-fuchsia-500 shadow-[0_0_15px_rgba(192,38,211,0.4)]"
            >
              Child mode
            </button>
          )}
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
      <aside className="w-full border-b border-slate-100 bg-white px-5 py-7 shadow-sm md:sticky md:top-0 md:h-[calc(100vh-68px)] md:w-[382px] md:overflow-y-auto md:border-b-0 md:border-r">
        <p className="text-lg font-black uppercase tracking-[0.32em] text-fuchsia-500">Workspace</p>
        <nav className="mt-7">
          <ul className="flex gap-3 overflow-x-auto pb-2 md:block md:space-y-6 md:overflow-visible md:pb-0">
            {items.map(i => {
              const hash = i.path.includes('#') ? `#${i.path.split('#')[1]}` : ''
              const active = hash ? activeHash === hash : activeHash === ''
              return (
                <li key={i.path} className="shrink-0 md:shrink">
                  <a
                    href={i.path}
                    className={`block rounded-2xl px-6 py-4 text-lg font-black text-slate-700 transition duration-200 md:text-xl ${
                      active
                        ? 'border border-cyan-200 bg-white text-cyan-700 shadow-lg shadow-cyan-900/10'
                        : 'border border-transparent hover:border-cyan-100 hover:bg-cyan-50 hover:text-cyan-700'
                    }`}
                  >
                    {i.label}
                  </a>
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
      <aside className="w-full border-b border-slate-100 bg-white px-5 py-7 shadow-sm md:sticky md:top-0 md:h-[calc(100vh-68px)] md:w-[382px] md:overflow-y-auto md:border-b-0 md:border-r">
        <p className="text-lg font-black uppercase tracking-[0.32em] text-amber-500">Marketplace</p>
        <nav className="mt-7">
          <ul className="flex gap-3 overflow-x-auto pb-2 md:block md:space-y-6 md:overflow-visible md:pb-0">
            {items.map(i => {
              const hash = i.path.includes('#') ? `#${i.path.split('#')[1]}` : ''
              const active = hash ? activeHash === hash : activeHash === ''
              return (
                <li key={i.path} className="shrink-0 md:shrink">
                  <a
                    href={i.path}
                    className={`block rounded-2xl px-6 py-4 text-lg font-black text-slate-700 transition duration-200 md:text-xl ${
                      active
                        ? 'border border-amber-200 bg-white text-amber-700 shadow-lg shadow-amber-900/10'
                        : 'border border-transparent hover:border-amber-100 hover:bg-amber-50 hover:text-amber-700'
                    }`}
                  >
                    {i.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
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
