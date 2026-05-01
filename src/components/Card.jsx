import React from 'react'

export default function Card({ title, children }){
  return (
    <div className="group rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-cyan-900/5 backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-fuchsia-900/10">
      {title && <h3 className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-cyan-700 transition group-hover:text-fuchsia-600">{title}</h3>}
      <div className="text-lg font-bold text-slate-900">{children}</div>
    </div>
  )
}
