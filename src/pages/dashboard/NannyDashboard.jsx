import React from 'react'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'
import { Outlet, Link, useLocation } from 'react-router-dom'

const items = [
  {label:'Assigned Children', path:'/dashboard/nanny/children'},
  {label:'Activity Update', path:'/dashboard/nanny/update'},
  {label:'Applications', path:'/dashboard/nanny/applications'},
  {label:'Profile', path:'/dashboard/nanny/profile'},
  {label:'Availability', path:'/dashboard/nanny/availability'},
  {label:'Safety', path:'/dashboard/nanny/safety'},
  {label:'Apply for Work', path:'/dashboard/nanny/apply'}
]

export default function NannyDashboard(){
  const loc = useLocation()
  return (
    <div className="min-h-[calc(100vh-68px)] md:flex">
      <Sidebar items={items} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur-xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Nanny Dashboard</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Daily care workspace</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Keep assigned children and activity updates easy to find throughout the day.</p>
        </div>

        {loc.pathname === '/dashboard/nanny' || loc.pathname === '/dashboard/nanny/' ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card title={ <Link to="children" className="text-slate-900">Assigned Children</Link> }>See assigned children</Card>
            <Card title={ <Link to="update" className="text-slate-900">Activity Update</Link> }>Submit daily notes</Card>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}
