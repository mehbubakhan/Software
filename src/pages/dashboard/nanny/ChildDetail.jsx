import React, { useEffect, useState } from 'react'
import api from '../../../services/api'
import { useParams } from 'react-router-dom'

export default function ChildDetail(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [timetable, setTimetable] = useState('')
  useEffect(()=>{ fetchDetail() },[id])
  const fetchDetail = async ()=>{
    try{
      const r = await api.get(`/children/${id}`)
      if(r.data.ok) setData(r.data.data)
    }catch(err){ console.error('Failed to load child detail', err); setData({ child: { name: 'Unknown' }, activities: [] }) }
  }
  const submitTimetable = async e =>{
    e.preventDefault()
    await api.post(`/children/${id}/timetable`, { timetable: { text: timetable } })
    setTimetable('')
    fetchDetail()
  }
  if(!data) return <div>Loading...</div>
  return (
    <div>
      <h3 className="text-xl font-bold">{data.child.name}</h3>
      <div className="text-sm text-slate-600 mb-4">DOB: {data.child.dob}</div>
      <form onSubmit={submitTimetable} className="mb-4">
        <label className="block text-sm font-medium">Add Timetable</label>
        <textarea value={timetable} onChange={e=>setTimetable(e.target.value)} className="w-full p-2 border rounded mt-1" />
        <button className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded">Save Timetable</button>
      </form>

      <h4 className="font-semibold mb-2">Activity Updates</h4>
      <ul className="space-y-2">
        {data.activities.map(a=> (
          <li key={a.id} className="p-3 bg-white rounded shadow-sm">
            <div className="text-sm text-slate-700">{a.type} — {new Date(a.created_at).toLocaleString()}</div>
            <div className="text-sm text-slate-600">{typeof a.details === 'object' ? JSON.stringify(a.details) : a.details}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
