import React from 'react'
import Sidebar from '../../components/Sidebar'
import { Outlet } from 'react-router-dom'

const items = [
  {label:'Dashboard', path:'/dashboard/nanny'},
  {label:'Profile & Verification', path:'/dashboard/nanny/profile'},
  {label:'Job Requests', path:'/dashboard/nanny/applications'},
  {label:'Assigned Children', path:'/dashboard/nanny/children'},
  {label:'Activity Reports', path:'/dashboard/nanny/update'},
  {label:'Safety & SOS', path:'/dashboard/nanny/safety'},
  {label:'Availability', path:'/dashboard/nanny/availability'},
  {label:'Communication', path:'/dashboard/nanny/communication'},
  {label:'Reviews', path:'/dashboard/nanny/reviews'},
  {label:'Payments', path:'/dashboard/nanny/payments'},
  {label:'Find Work', path:'/dashboard/nanny/apply'}
]

export default function NannyDashboard(){
  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 md:flex">
      <Sidebar items={items} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 rounded-lg border border-white bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">BabyCare+ SafeGuard</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Nanny safety dashboard</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Manage verified care work, assigned children, activity updates, safety checks, SOS response, schedules, parent communication, reviews, and payments.
          </p>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
