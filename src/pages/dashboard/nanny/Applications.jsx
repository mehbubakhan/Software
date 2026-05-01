import React, { useEffect, useState } from 'react'
import api from '../../../services/api'
import SOSButton from '../../../components/SOSButton'

export default function Applications(){
  const [apps, setApps] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(()=>{ load() },[])
  const load = async ()=>{
    setLoading(true)
    setError(null)
    try{
      // Try admin admissions view first
      const r = await api.get('/admissions/pending')
      if(r.data && r.data.ok){ setApps(r.data.data); setLoading(false); return }
    }catch(e){
      // If forbidden for this user, try nanny applications
      if(e.response && e.response.status !== 403){ setError(e.message); setLoading(false); return }
    }

    try{
      const r2 = await api.get('/applications/mine')
      if(r2.data && r2.data.ok){ setApps(r2.data.data) }
    }catch(e){ setError(e.message) }
    setLoading(false)
  }

  const decide = async (id, action)=>{
    try{
      await api.post(`/admissions/${id}/decide`, { action })
      await load()
    }catch(e){ setError(e.message) }
  }

  if(loading) return <div>Loading...</div>
  if(error) return <div className="text-red-600">Error: {error}</div>

  return (
    <div>
      <SOSButton />
      <h3 className="text-xl font-bold mb-4">Applications</h3>
      <ul className="space-y-2">
        {apps.map(a=> (
          <li key={a.id} className="p-4 bg-white rounded shadow-sm flex justify-between">
            <div>
              <div className="font-semibold">{a.child_name || a.job_title || 'Application'}</div>
              <div className="text-sm text-slate-600">{a.parent_name ? `Parent: ${a.parent_name}` : a.status ? `Status: ${a.status}` : ''}</div>
            </div>
            {a.status === 'pending' ? (
              <div className="space-x-2">
                <button onClick={()=>decide(a.id,'approve')} className="px-3 py-1 bg-emerald-600 text-white rounded">Approve</button>
                <button onClick={()=>decide(a.id,'reject')} className="px-3 py-1 bg-red-500 text-white rounded">Reject</button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
