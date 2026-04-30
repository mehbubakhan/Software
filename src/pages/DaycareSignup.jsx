import React, { useState } from 'react'
import FormInput from '../components/FormInput'
import api from '../services/api'

export default function DaycareSignup(){
  const [form, setForm] = useState({ name: '', email: '', password: '', daycareName: '' })
  const submit = async e => {
    e.preventDefault()
    try{ await api.post('/auth/signup', { ...form, role: 'admin' }); alert('Registered') }catch(e){alert('Error')}
  }
  return (
    <div className="p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Daycare Admin Signup</h2>
        <form onSubmit={submit}>
          <FormInput label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <FormInput label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <FormInput label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <FormInput label="Daycare Name" value={form.daycareName} onChange={e => setForm({...form, daycareName: e.target.value})} />
          <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded" type="submit">Create Account</button>
        </form>
      </div>
    </div>
  )
}
