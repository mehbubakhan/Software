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
    try{
      await api.post(`/children/${id}/timetable`, { timetable: { text: timetable } })
      setTimetable('')
      fetchDetail()
    }catch(err){ alert('Failed to save timetable: '+err.message) }
  }
  if(!data) return <div>Loading...</div>
  return (
    <div>
      <h3 className="text-xl font-bold">{data.child.name}</h3>
      <div className="text-sm text-slate-600 mb-4">DOB: {data.child.dob}</div>
      <form onSubmit={submitTimetable} className="mb-4">
        <label className="block text-sm font-medium">Add Timetable</label>
        <textarea value={timetable} onChange={e=>setTimetable(e.target.value)} className="w-full p-2 border rounded mt-1" />
        <div className="mt-2">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded mr-2">Save Timetable</button>
          <button type="button" onClick={async ()=>{ await api.post('/activities', { child_id: id, type:'attendance', details:{ action:'checkin' } }); alert('Checked in') }} className="px-4 py-2 bg-gray-200 rounded">Check-in</button>
          <button type="button" onClick={async ()=>{ await api.post('/activities', { child_id: id, type:'attendance', details:{ action:'checkout' } }); alert('Checked out') }} className="px-4 py-2 bg-gray-200 rounded ml-2">Check-out</button>
        </div>
      </form>

      <h4 className="font-semibold mb-2">Activity Updates</h4>
      <ul className="space-y-2">
        {data.activities.map(a=> (
          <li key={a.id} className="p-3 bg-white rounded shadow-sm">
            <div className="text-sm text-slate-700">{a.type} — {new Date(a.created_at).toLocaleString()}</div>
            <div className="text-sm text-slate-600">{typeof a.details === 'object' ? (a.details.text || JSON.stringify(a.details)) : a.details}</div>
            {a.details && a.details.photo_url ? <img src={a.details.photo_url} alt="activity" className="mt-2 max-w-xs rounded"/> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
