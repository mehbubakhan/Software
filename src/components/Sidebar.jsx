import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar({ items = [] }){
  return (
    <aside className="w-60 bg-white p-4 border-r min-h-screen">
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.path}><Link to={i.path} className="block p-2 rounded hover:bg-gray-100">{i.label}</Link></li>
        ))}
      </ul>
    </aside>
  )
}
