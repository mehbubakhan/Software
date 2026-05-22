import React, { useState } from 'react'
import api from '../../../services/api'

export default function Update(){
  const [childId, setChildId] = useState('')
  const [type, setType] = useState('note')
  const [details, setDetails] = useState('')
  const [activities, setActivities] = useState([])

  const submit = async e =>{
    e.preventDefault()
    try{
      await api.post('/activities', { child_id: childId, type, details: { text: details, status: 'sent' } })
      setDetails('')
      loadActivities()
    }catch(err){ console.error('Failed to create activity', err); alert('Failed to create activity: '+(err.response?.data?.message||err.message)) }
  }

  const loadActivities = async ()=>{
    if(!childId) return
    try{
      const r = await api.get(`/activities/child/${childId}`)
      if(r.data.ok) setActivities(r.data.data)
    }catch(err){ console.error('Failed to load activities', err); setActivities([]) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-slate-950">Child Activity Reports</h3>
        <p className="mt-1 text-sm text-slate-600">Share meal, sleep, playtime, mood, health, attendance, and media-style snapshots with parents.</p>
      </div>
      <form onSubmit={submit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <input value={childId} onChange={e=>setChildId(e.target.value)} placeholder="Child ID" className="w-full rounded-lg border border-slate-200 p-3 text-sm sm:w-48" />
        <select value={type} onChange={e=>setType(e.target.value)} className="rounded-lg border border-slate-200 p-3 text-sm">
          <option value="note">Note</option>
          <option value="meal">Meal update</option>
          <option value="sleep">Sleep tracking</option>
          <option value="playtime">Playtime activity</option>
          <option value="mood">Mood update</option>
          <option value="health">Health note</option>
          <option value="attendance">Check-in / check-out</option>
        </select>
        <textarea value={details} onChange={e=>setDetails(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 text-sm" placeholder="Details" />
        <div>
          <button type="submit" className="mr-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">Send Update</button>
          <button type="button" onClick={loadActivities} className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-300">Load Activities</button>
        </div>
      </form>

      <ul className="space-y-2">
        {activities.map(a=> (
          <li key={a.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-bold text-slate-700">{a.type} - {new Date(a.created_at).toLocaleString()}</div>
            <div className="text-sm text-slate-600">{typeof a.details === 'object' ? JSON.stringify(a.details) : a.details}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
