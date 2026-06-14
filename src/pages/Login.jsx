import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormInput from '../components/FormInput'
import { motion } from 'framer-motion'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await login(form)
      if (res.user) nav('/role-redirect')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed'
      alert(msg)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-72px)] bg-[#F4F4F4] text-[#030000] font-sans overflow-hidden flex items-center justify-center selection:bg-[#E8C1A0] px-4 py-10 sm:px-6 lg:px-8">
      
      {/* --- BACK TO HOME BUTTON --- */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF]/60 backdrop-blur-md border border-[#FFFFFF] shadow-sm text-sm font-semibold text-[#1C2541] transition-all hover:-translate-y-0.5 hover:bg-[#FFFFFF]/90 hover:shadow-md"
      >
        <span className="text-lg leading-none">&larr;</span> Home
      </Link>

      {/* --- AMBIENT BACKGROUND BLOBS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#E8C1A0] to-[#DDD3D3] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#F4A261] to-[#EFEFEF] blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-12">
        
        {/* --- LEFT SECTION --- */}
        <section className="hidden lg:flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[#FFFFFF]/60 backdrop-blur-md border border-[#FFFFFF] shadow-sm text-sm font-semibold tracking-wide text-[#1C2541] uppercase">
              Daycare care desk
            </div>
            <h1 className="max-w-xl text-5xl md:text-6xl font-extrabold text-[#0B132B] mb-6 leading-[1.1] tracking-tight">
              Welcome back to a brighter way to manage little days.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#5F5A5F]">
              Sign in to coordinate admissions, families, staff, activities, and everyday daycare updates from one seamless workspace.
            </p>
            
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {['Families', 'Care teams', 'Activities'].map((item, idx) => (
                <motion.div 
                  key={item} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                  className="rounded-2xl border border-[#FFFFFF] bg-[#FFFFFF]/70 px-5 py-4 text-center text-sm font-bold text-[#1C2541] shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-[#FFFFFF]/90 hover:shadow-md"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* --- RIGHT SECTION (LOGIN FORM) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto w-full max-w-md rounded-3xl border border-[#FFFFFF] bg-[#FFFFFF]/70 p-8 shadow-xl shadow-[#D9D9D9]/50 backdrop-blur-xl"
        >
          <div className="mb-8 text-center sm:text-left">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#F4A261]">Login</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0B132B]">Good to see you</h2>
            <p className="mt-2 text-sm leading-6 text-[#5F5A5F]">Enter your email and password to continue.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <FormInput 
              label="Email" 
              type="email" 
              placeholder="you@example.com" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
            <FormInput 
              label="Password" 
              type="password" 
              placeholder="Enter your password" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
            <button 
              className="mt-6 w-full rounded-full bg-[#0B132B] px-6 py-3.5 font-semibold text-[#FFFFFF] shadow-lg shadow-[#0B132B]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1C2541] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#1C2541]/30" 
              type="submit"
            >
              Log In
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-[#D9D9D9] bg-[#FFFFFF]/50 px-4 py-4 text-center text-sm text-[#5F5A5F] shadow-sm">
            New here?{' '}
            <Link to="/signup" className="font-bold text-[#1C2541] transition-colors hover:text-[#F4A261]">
              Create an account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
