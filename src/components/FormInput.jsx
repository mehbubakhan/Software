import React from 'react'

export default function FormInput({ label, ...props }){
  return (
    <label className="block mb-4">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="mt-2 block w-full rounded-xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 hover:border-cyan-300 focus:border-fuchsia-400 focus:bg-white focus:ring-4 focus:ring-fuchsia-100"
        {...props}
      />
    </label>
  )
}
