import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

export default function Applications(){
  const [apps, setApps] = useState([])
  useEffect(()=>{ load() },[])
  const load = async ()=>{
    // For now show pending admissions (admin-facing); if nanny needs own apps, extend later
    const r = await api.get('/admissions/pending')
    if(r.data.ok) setApps(r.data.data)
  }
  const decide = async (id, action)=>{
    await api.post(`/admissions/${id}/decide`, { action })
    load()
  }
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Pending Applications</h3>
      <ul className="space-y-2">
        {apps.map(a=> (
          <li key={a.id} className="p-4 bg-white rounded shadow-sm flex justify-between">
            <div>
              <div className="font-semibold">{a.child_name}</div>
              <div className="text-sm text-slate-600">Parent: {a.parent_name}</div>
            </div>
            <div className="space-x-2">
              <button onClick={()=>decide(a.id,'approve')} className="px-3 py-1 bg-emerald-600 text-white rounded">Approve</button>
              <button onClick={()=>decide(a.id,'reject')} className="px-3 py-1 bg-red-500 text-white rounded">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
