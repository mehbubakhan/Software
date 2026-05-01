import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="relative min-h-[calc(100vh-68px)] overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="auth-shape auth-shape-one" />
      <div className="auth-shape auth-shape-two" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section>
          <p className="mb-4 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-sm backdrop-blur">
            Colorful care operations
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-6xl">
            Daycare management that feels calm, bright, and organized.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            Coordinate families, children, staff, activities, jobs, and transport in one modern workspace designed for quick daily use.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-500/25">
              Create account
            </Link>
            <Link to="/login" className="rounded-xl border border-slate-200 bg-white/75 px-6 py-3 font-bold text-slate-800 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:text-cyan-700 hover:shadow-lg">
              Login
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {[
            ['Admissions', 'Review family requests faster', 'from-cyan-400 to-blue-500'],
            ['Activities', 'Track daily child moments', 'from-emerald-400 to-teal-500'],
            ['Teams', 'Manage staff and nannies', 'from-violet-400 to-fuchsia-500'],
            ['Packages', 'Keep plans easy to scan', 'from-rose-400 to-orange-400']
          ].map(([title, text, color]) => (
            <div key={title} className="group rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-cyan-900/5 backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-xl">
              <div className={`mb-5 h-2 w-20 rounded-full bg-gradient-to-r ${color}`} />
              <h2 className="text-xl font-black text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
