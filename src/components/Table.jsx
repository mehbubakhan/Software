import React from 'react'

export default function Table({ columns = [], data = [] }){
  return (
    <div className="overflow-auto rounded-2xl border border-white/70 bg-white/80 shadow-lg shadow-cyan-900/5 backdrop-blur-xl">
      <table className="min-w-full">
        <thead className="bg-slate-950 text-white">
          <tr>
            {columns.map(c => <th key={c} className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.16em]">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-slate-100 transition hover:bg-cyan-50/80">
              {columns.map((c, i) => <td key={i} className="px-4 py-4 text-sm font-semibold text-slate-700">{row[c] ?? ''}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
