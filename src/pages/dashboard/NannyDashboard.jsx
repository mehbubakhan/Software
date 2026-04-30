import React from 'react'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'

const items = [ {label:'Assigned Children', path:'/dashboard/nanny/children'}, {label:'Activity Update', path:'/dashboard/nanny/update'}, {label:'Applications', path:'/dashboard/nanny/applications'} ]

export default function NannyDashboard(){
  return (
    <div className="flex">
      <Sidebar items={items} />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Nanny Dashboard</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card title="Assigned Children">Anna, Tom</Card>
          <Card title="Activity Update">Submit daily notes</Card>
        </div>
      </main>
    </div>
  )
}
