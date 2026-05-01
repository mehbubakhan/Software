import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

export default function ApplyForWork(){
  const [jobs, setJobs] = useState([])
  useEffect(()=>{ load() },[])
  const load = async ()=>{
    const r = await api.get('/jobs/open')
    if(r.data.ok) setJobs(r.data.data)
  }
  const apply = async (job_id)=>{
    await api.post('/jobs/apply', { job_id })
    load()
  }
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Open Jobs</h3>
      <ul className="space-y-2">
        {jobs.map(j=> (
          <li key={j.id} className="p-4 bg-white rounded shadow-sm flex justify-between">
            <div>
              <div className="font-semibold">{j.title}</div>
              <div className="text-sm text-slate-600">{j.description}</div>
            </div>
            <div>
              <button onClick={()=>apply(j.id)} className="px-3 py-1 bg-emerald-600 text-white rounded">Apply</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
