import React from 'react'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'

const items = [
  {label:'Admission', path:'/dashboard/parent/admission'},
  {label:'Activities', path:'/dashboard/parent/activities'},
  {label:'Packages', path:'/dashboard/parent/packages'},
  {label:'CCTV Demo', path:'/dashboard/parent/cctv'},
  {label:'GPS Demo', path:'/dashboard/parent/gps'}
]

export default function ParentDashboard(){
  return (
    <div className="min-h-[calc(100vh-68px)] md:flex">
      <Sidebar items={items} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur-xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-500">Parent Dashboard</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Your child care overview</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">A quick, friendly view of admission progress, activities, packages, and live demo tools.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Admission Status">Approved</Card>
          <Card title="Child Activity">Napping, Eating</Card>
          <Card title="Package">Monthly - Gold</Card>
        </div>
        <div className="mt-6">
          <Card title="CCTV Demo">(CCTV demo placeholder)</Card>
        </div>
      </main>
    </div>
  )
}
