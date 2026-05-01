import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

export default function Update(){
  const [childId, setChildId] = useState('')
  const [type, setType] = useState('note')
  const [details, setDetails] = useState('')
  const [activities, setActivities] = useState([])

  const submit = async e =>{
    e.preventDefault()
    await api.post('/activities', { child_id: childId, type, details: { text: details, status: 'pending' } })
    setDetails('')
    loadActivities()
  }

  const loadActivities = async ()=>{
    if(!childId) return
    const r = await api.get(`/activities/child/${childId}`)
    if(r.data.ok) setActivities(r.data.data)
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Activity Update</h3>
      <form onSubmit={submit} className="mb-4 space-y-2">
        <input value={childId} onChange={e=>setChildId(e.target.value)} placeholder="Child ID" className="p-2 border rounded w-48" />
        <select value={type} onChange={e=>setType(e.target.value)} className="p-2 border rounded">
          <option value="note">Note</option>
          <option value="task">Task</option>
          <option value="timetable">Timetable</option>
        </select>
        <textarea value={details} onChange={e=>setDetails(e.target.value)} className="w-full p-2 border rounded" placeholder="Details" />
        <div>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded mr-2">Create</button>
          <button type="button" onClick={loadActivities} className="px-4 py-2 bg-gray-200 rounded">Load Activities</button>
        </div>
      </form>

      <ul className="space-y-2">
        {activities.map(a=> (
          <li key={a.id} className="p-3 bg-white rounded shadow-sm">
            <div className="text-sm text-slate-700">{a.type} — {new Date(a.created_at).toLocaleString()}</div>
            <div className="text-sm text-slate-600">{typeof a.details === 'object' ? JSON.stringify(a.details) : a.details}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
