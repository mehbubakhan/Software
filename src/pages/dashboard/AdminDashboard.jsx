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
    <div className="flex">
      <Sidebar items={items} />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Daycare Admin Dashboard</h2>
        <div className="grid grid-cols-1 gap-4">
          <Table columns={cols} data={rows} />
        </div>
      </main>
    </div>
  )
}
