import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FormInput from '../components/FormInput'
import api from '../services/api'

export default function DaycareSignup(){
  const [form, setForm] = useState({ name: '', email: '', password: '', daycareName: '' })
  const submit = async e => {
    e.preventDefault()
    try{ 
      await api.post('/auth/signup', { ...form, role: 'daycare' })
      alert('Registered') 
    }catch(err){
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Signup failed'
      alert(msg)
    }
  }
  return (
    <div className="relative min-h-[calc(100vh-68px)] overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="auth-shape auth-shape-two" />
      <div className="mx-auto max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Daycare Admin</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Build your care hub</h2>
        <p className="mb-6 mt-2 text-sm leading-6 text-slate-600">Set up the admin account that manages admissions, staff, and operations.</p>
        <form onSubmit={submit}>
          <FormInput label="Name" placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <FormInput label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <FormInput label="Password" type="password" placeholder="Create a password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <FormInput label="Daycare Name" placeholder="Center name" value={form.daycareName} onChange={e => setForm({...form, daycareName: e.target.value})} />
          <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl" type="submit">Create Account</button>
        </form>
        <Link to="/signup" className="mt-5 inline-flex text-sm font-bold text-cyan-700 transition hover:text-fuchsia-600">Back to roles</Link>
      </div>
    </div>
  )
}
