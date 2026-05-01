import React, { useEffect, useState } from 'react'
import api from '../../../services/api'
import { Link } from 'react-router-dom'

export default function Children(){
  const [children, setChildren] = useState([])
  useEffect(()=>{ fetchAssigned() },[])
  const fetchAssigned = async ()=>{
    try{
      const r = await api.get('/children/assigned')
      if(r.data.ok) setChildren(r.data.data)
    }catch(err){ console.error('Failed to load assigned children', err); setChildren([]) }
  }
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Assigned Children</h3>
      <ul className="space-y-2">
        {children.map(c => (
          <li key={c.id} className="p-4 bg-white rounded shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Link to={`${c.id}`} className="font-semibold text-lg">{c.name}</Link>
              <div className="text-sm text-slate-600">DOB: {c.dob} {c.parent_name?`• Parent: ${c.parent_name}`:''}</div>
              <div className="text-sm text-slate-600">Contact: {c.parent_email || '—'}</div>
            </div>
            <div className="mt-3 md:mt-0 space-x-2">
              <button onClick={async ()=>{ await api.post('/activities', { child_id: c.id, type: 'attendance', details: { action:'checkin' } }); alert('Checked in') }} className="px-3 py-1 bg-emerald-600 text-white rounded">Check-in</button>
              <button onClick={async ()=>{ await api.post('/activities', { child_id: c.id, type: 'attendance', details: { action:'checkout' } }); alert('Checked out') }} className="px-3 py-1 bg-gray-200 rounded">Check-out</button>
              <Link to={`${c.id}`} className="px-3 py-1 bg-white border rounded">Details</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
