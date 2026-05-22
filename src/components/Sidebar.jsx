import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar({ items = [], variant = 'default' }){
  const [activeHash, setActiveHash] = React.useState(() => {
    if (typeof window === 'undefined') return ''
    return window.location.hash || ''
  })

  React.useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash || '')
    window.addEventListener('hashchange', updateHash)
    return () => window.removeEventListener('hashchange', updateHash)
  }, [])

  if (variant === 'parent-workspace') {
    return (
      <aside className="w-full border-b border-cyan-100 bg-gradient-to-b from-cyan-50 to-slate-50 px-4 py-5 md:min-h-[calc(100vh-68px)] md:w-72 md:border-b-0 md:border-r md:px-5">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-fuchsia-500">Parent Module</p>
        <nav className="mt-5">
          <ul className="flex gap-2 overflow-x-auto pb-1 md:block md:space-y-2 md:overflow-visible md:pb-0">
            {items.map(i => (
              <li key={i.path} className="shrink-0 md:shrink">
                <NavLink
                  to={i.path}
                  end={i.path === '/dashboard/parent'}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-sm font-bold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                      isActive ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-700 hover:bg-white/70 hover:text-cyan-700'
                    }`
                  }
                >
                  {i.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
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
