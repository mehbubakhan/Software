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
          <li key={c.id} className="p-4 bg-white rounded shadow-sm">
            <Link to={`${c.id}`} className="font-semibold">{c.name}</Link>
            <div className="text-sm text-slate-600">DOB: {c.dob}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
