import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FormInput from '../components/FormInput'
import api from '../services/api'

export default function RoleSignup({ role, title, eyebrow, description, accent = 'from-cyan-500 to-blue-500', extraLabel = 'Organization Name', extraKey = 'organization' }){
  const [form, setForm] = useState({ name: '', email: '', password: '', [extraKey]: '' })

  const submit = async e => {
    e.preventDefault()
    try{
      await api.post('/auth/signup', { ...form, role })
      alert('Registered - proceed to login')
    }catch(err){
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Signup failed'
      alert(msg)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-68px)] overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="auth-shape auth-shape-one" />
      <div className="auth-shape auth-shape-two" />
      <div className="mx-auto max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-600">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">{title}</h2>
        <p className="mb-6 mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <form onSubmit={submit}>
          <FormInput label="Name" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <FormInput label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <FormInput label="Password" type="password" placeholder="Create a password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <FormInput label={extraLabel} placeholder={extraLabel} value={form[extraKey]} onChange={e => setForm({ ...form, [extraKey]: e.target.value })} />
          <button className={`mt-3 w-full rounded-xl bg-gradient-to-r ${accent} px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl`} type="submit">Create Account</button>
        </form>
        <Link to="/signup" className="mt-5 inline-flex text-sm font-bold text-cyan-700 transition hover:text-fuchsia-600">Back to roles</Link>
      </div>
    </div>
  )
}
