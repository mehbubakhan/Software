import React from 'react'
import { Link } from 'react-router-dom'

export default function Signup(){
  const roles = [
    {label: 'Parent', to: '/signup/parent'},
    {label: 'Daycare Admin', to: '/signup/daycare'},
    {label: 'Nanny', to: '/signup/nanny'},
    {label: 'Transport Staff', to: '/signup/transport'}
  ]

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Create account</h2>
        <div className="space-y-3">
          {roles.map(r => (
            <Link key={r.to} to={r.to} className="block p-3 border rounded hover:bg-gray-50">{r.label}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}
