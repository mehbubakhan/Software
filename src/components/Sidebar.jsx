import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar({ items = [] }){
  return (
    <aside className="w-full border-b border-white/70 bg-white/65 p-4 backdrop-blur-xl md:min-h-[calc(100vh-68px)] md:w-64 md:border-b-0 md:border-r">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-fuchsia-500">Workspace</p>
      <ul className="flex gap-2 overflow-x-auto md:block md:space-y-2">
        {items.map(i => (
          <li key={i.path} className="shrink-0 md:shrink">
            <Link to={i.path} className="block rounded-xl border border-transparent px-4 py-3 text-sm font-bold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white hover:text-cyan-700 hover:shadow-md">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
