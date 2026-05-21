import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="auth-shape auth-shape-one" />
      <div className="auth-shape auth-shape-two" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
        <section className="w-full rounded-[2rem] border border-white/80 bg-white/70 p-8 text-center shadow-2xl shadow-cyan-900/10 backdrop-blur-xl sm:p-12">
          <p className="mx-auto mb-5 inline-flex rounded-full border border-cyan-100 bg-cyan-50/80 px-4 py-2 text-sm font-semibold text-cyan-700">
            Welcome to Daycare Connect
          </p>
          <h1 className="mx-auto max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Simple daycare management made for quick access.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
            Start with a clear welcome page, then choose sign in to see the role options or log in to continue to your account.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-blue-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-500/25">
              Sign in
            </Link>
            <Link to="/login" className="rounded-2xl border border-white/80 bg-white/90 px-8 py-3.5 font-bold text-slate-900 shadow-lg shadow-cyan-900/10 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 hover:shadow-xl">
              Log in
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
