import React, { useEffect, useState } from 'react'
import api from '../../../services/api'
import SOSButton from '../../../components/SOSButton'

export default function Applications(){
  const [apps, setApps] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
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
      <div className="mb-3">
        <label className="mr-2">Filter:</label>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="p-2 border rounded" onBlur={load}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={load} className="ml-2 px-3 py-1 bg-emerald-600 text-white rounded">Refresh</button>
      </div>
      <ul className="space-y-2">
        {apps.filter(a=> filter==='all' || (a.status && a.status===filter)).map(a=> (
          <li key={a.id} className="p-4 bg-white rounded shadow-sm flex flex-col md:flex-row md:justify-between">
            <div>
              <div className="font-semibold">{a.child_name || a.job_title || 'Application'}</div>
              <div className="text-sm text-slate-600">{a.parent_name ? `Parent: ${a.parent_name}` : a.status ? `Status: ${a.status}` : ''}</div>
              {a.job_id ? <div className="text-sm">Job: {a.job_id}</div> : null}
            </div>
            <div className="mt-2 md:mt-0">
              {a.status === 'pending' ? (
                <div className="space-x-2">
                  <button onClick={()=>decide(a.id,'approve')} className="px-3 py-1 bg-emerald-600 text-white rounded">Approve</button>
                  <button onClick={()=>decide(a.id,'reject')} className="px-3 py-1 bg-red-500 text-white rounded">Reject</button>
                </div>
              ) : <div className="text-sm">{a.status}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
