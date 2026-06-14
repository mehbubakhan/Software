import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, Bot, LayoutDashboard, Settings, ShoppingBag, HeartHandshake
} from 'lucide-react'

export default function Signup() {
  const roles = [
    { label: 'Parent', to: '/signup/parent', note: 'Track your child and updates', icon: <Users className="w-6 h-6 text-[#1C2541]" /> },
    { label: 'Nanny', to: '/signup/nanny', note: 'Find care work and activities', icon: <HeartHandshake className="w-6 h-6 text-[#F4A261]" /> },
    { label: 'Daycare', to: '/signup/daycare', note: 'Manage care rooms and daycare setup', icon: <LayoutDashboard className="w-6 h-6 text-[#1C2541]" /> },
    { label: 'Admin', to: '/signup/admin', note: 'Oversee users, requests, and operations', icon: <Settings className="w-6 h-6 text-[#F4A261]" /> },
    { label: 'Marketplace Seller', to: '/signup/marketplace-seller', note: 'Offer daycare products and services', icon: <ShoppingBag className="w-6 h-6 text-[#1C2541]" /> },
    { label: 'Orphanage / Adoption', to: '/signup/orphanage-manager', note: 'Coordinate orphanage and adoption support', icon: <Bot className="w-6 h-6 text-[#F4A261]" /> }
  ]

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
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#E8C1A0] to-[#DDD3D3] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#F4A261] to-[#EFEFEF] blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] items-center gap-12">
        
        {/* --- LEFT SECTION --- */}
        <section className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[#FFFFFF]/60 backdrop-blur-md border border-[#FFFFFF] shadow-sm text-sm font-semibold tracking-wide text-[#F4A261] uppercase">
              Choose your doorway
            </div>
            <h1 className="max-w-xl text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0B132B] mb-6 leading-[1.1] tracking-tight mx-auto lg:mx-0">
              Create the account that matches your daycare world.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#5F5A5F] mx-auto lg:mx-0">
              Each role gets its own path, tools, and dashboard so the experience starts clean from the first click.
            </p>
            <Link 
              to="/login" 
              className="mt-10 inline-flex rounded-full bg-[#FFFFFF] px-8 py-3.5 font-bold text-[#1C2541] shadow-sm border border-[#D9D9D9] transition-all duration-300 hover:-translate-y-1 hover:border-[#1C2541] hover:bg-[#EFEFEF] hover:shadow-md"
            >
              Already have an account? Log In
            </Link>
          </motion.div>
        </section>

        {/* --- RIGHT SECTION (ROLE SELECTION) --- */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full rounded-3xl border border-[#FFFFFF] bg-[#FFFFFF]/70 p-6 shadow-xl shadow-[#D9D9D9]/50 backdrop-blur-xl sm:p-8"
        >
          <div className="mb-8 text-center sm:text-left">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#F4A261]">Signup</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0B132B]">Select your role</h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {roles.map((r, i) => (
              <motion.div
                key={r.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              >
                <Link 
                  to={r.to} 
                  className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-[#FFFFFF] bg-[#FFFFFF]/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#F4A261]/30"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECEBEB] shadow-inner transition-transform duration-300 group-hover:scale-110">
                    {r.icon}
                  </div>
                  <span className="block text-lg font-bold text-[#030000] mb-1">{r.label}</span>
                  <span className="block text-sm leading-relaxed text-[#5F5A5F] flex-grow">{r.note}</span>
                  <span className="mt-4 inline-flex text-sm font-bold text-[#1C2541] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#F4A261]">
                    Continue →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
