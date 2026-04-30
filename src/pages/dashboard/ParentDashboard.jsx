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
    <div className="flex">
      <Sidebar items={items} />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Parent Dashboard</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card title="Admission Status">Approved</Card>
          <Card title="Child Activity">Napping, Eating</Card>
          <Card title="Package">Monthly — Gold</Card>
        </div>
        <div className="mt-6">
          <Card title="CCTV Demo">(CCTV demo placeholder)</Card>
        </div>
      </main>
    </div>
  )
}
