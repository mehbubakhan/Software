import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      alert('Login failed')
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={submit}>
          <FormInput label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <FormInput label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded" type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}
