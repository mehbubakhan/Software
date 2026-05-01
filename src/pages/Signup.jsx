import React from 'react'
import { Link } from 'react-router-dom'

export default function Signup(){
  const roles = [
    {label: 'Parent', to: '/signup/parent', note: 'Track your child and updates', color: 'from-rose-400 to-orange-400'},
    {label: 'Daycare Admin', to: '/signup/daycare', note: 'Manage admissions and rooms', color: 'from-cyan-400 to-blue-500'},
    {label: 'Nanny', to: '/signup/nanny', note: 'Find care work and activities', color: 'from-emerald-400 to-teal-500'},
    {label: 'Transport Staff', to: '/signup/transport', note: 'Coordinate safe daily rides', color: 'from-violet-400 to-fuchsia-500'}
  ]

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-auth-splash px-4 py-10 sm:px-6 lg:px-8">
      <div className="auth-shape auth-shape-one" />
      <div className="auth-shape auth-shape-two" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="text-slate-950">
          <p className="mb-4 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-fuchsia-700 shadow-sm backdrop-blur">
            Choose your doorway
          </p>
          <h1 className="max-w-xl text-4xl font-black leading-tight tracking-normal sm:text-5xl">
            Create the account that matches your daycare world.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-700">
            Each role gets its own path, tools, and dashboard so the experience starts clean from the first click.
          </p>
          <Link to="/login" className="mt-8 inline-flex rounded-xl border border-slate-200 bg-white/75 px-5 py-3 font-bold text-slate-800 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:text-cyan-700 hover:shadow-lg">
            Already have an account?
          </Link>
        </section>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl sm:p-7">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Signup</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Select your role</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
          {roles.map(r => (
            <Link key={r.to} to={r.to} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-xl">
              <span className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${r.color}`} />
              <span className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${r.color} text-lg font-black text-white shadow-lg transition duration-200 group-hover:scale-110`}>
                {r.label.charAt(0)}
              </span>
              <span className="block text-lg font-black text-slate-950">{r.label}</span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">{r.note}</span>
              <span className="mt-5 inline-flex text-sm font-bold text-cyan-700 transition group-hover:translate-x-1 group-hover:text-fuchsia-600">
                Continue
              </span>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}
