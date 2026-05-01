import React from 'react'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'

const items = [
  {label:'Assigned Children', path:'/dashboard/nanny/children'},
  {label:'Activity Update', path:'/dashboard/nanny/update'},
  {label:'Applications', path:'/dashboard/nanny/applications'}
]

export default function NannyDashboard(){
  return (
    <div className="min-h-[calc(100vh-68px)] md:flex">
      <Sidebar items={items} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur-xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Nanny Dashboard</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Daily care workspace</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Keep assigned children and activity updates easy to find throughout the day.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Assigned Children">Anna, Tom</Card>
          <Card title="Activity Update">Submit daily notes</Card>
        </div>
      </main>
    </div>
  )
}
