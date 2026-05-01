import React from 'react'
import Sidebar from '../../components/Sidebar'
import Table from '../../components/Table'

const items = [
  {label:'Admissions', path:'/dashboard/admin/admissions'},
  {label:'Job Posts', path:'/dashboard/admin/jobs'},
  {label:'Nanny Applications', path:'/dashboard/admin/nannies'},
  {label:'Children List', path:'/dashboard/admin/children'},
  {label:'Staff List', path:'/dashboard/admin/staff'},
  {label:'Packages', path:'/dashboard/admin/packages'}
]

export default function AdminDashboard(){
  const cols = ['Name','Role','Status']
  const rows = [ { Name: 'Alice', Role: 'Parent', Status: 'Active' }, { Name: 'Bob', Role: 'Nanny', Status: 'Pending' } ]
  return (
    <div className="min-h-[calc(100vh-68px)] md:flex">
      <Sidebar items={items} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur-xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Admin Dashboard</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Daycare command center</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Review people, admissions, job posts, and daily operations from one colorful workspace.</p>
        </div>
        <Table columns={cols} data={rows} />
      </main>
    </div>
  )
}
