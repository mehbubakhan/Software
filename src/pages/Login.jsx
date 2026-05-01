import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormInput from '../components/FormInput'

export default function Login(){
  const [form, setForm] = useState({ email: '', password: '' })
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try{
      const res = await login(form)
      if (res.user) nav('/role-redirect')
    }catch(err){
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed'
      alert(msg)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-auth-splash px-4 py-10 sm:px-6 lg:px-8">
      <div className="auth-shape auth-shape-one" />
      <div className="auth-shape auth-shape-two" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden text-slate-950 lg:block">
          <p className="mb-4 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-sm backdrop-blur">
            Daycare care desk
          </p>
          <h1 className="max-w-xl text-5xl font-black leading-tight tracking-normal">
            Welcome back to a brighter way to manage little days.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-700">
            Sign in to coordinate admissions, families, staff, activities, and everyday daycare updates from one cheerful workspace.
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {['Families', 'Care teams', 'Activities'].map(item => (
              <div key={item} className="rounded-2xl border border-white/70 bg-white/55 p-4 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-1 hover:bg-white/80 hover:shadow-lg">
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-500">Login</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Good to see you</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Use your account email and password to continue.</p>
          </div>

          <form onSubmit={submit}>
            <FormInput label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <FormInput label="Password" type="password" placeholder="Enter your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-500/25 focus:outline-none focus:ring-4 focus:ring-cyan-200" type="submit">
              Login
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm text-white">
            New here? <Link to="/signup" className="font-bold text-cyan-200 transition hover:text-fuchsia-200">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
