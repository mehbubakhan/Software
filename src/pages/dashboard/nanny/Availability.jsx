import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

export default function Availability(){
  const [availability, setAvailability] = useState({})
  useEffect(()=>{ load() },[])
  const load = async ()=>{ try{ const r = await api.get('/nanny/availability'); if(r.data.ok) setAvailability(r.data.data || {}) }catch(e){ console.error(e) } }
  const save = async ()=>{ try{ await api.post('/nanny/availability', { availability }); alert('Availability saved') }catch(e){ alert('Failed: '+e.message) } }
  const toggleDay = day => {
    setAvailability(prev=>({ ...prev, [day]: prev[day]?null:{ from:'09:00', to:'17:00' } }))
  }
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Availability</h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {['mon','tue','wed','thu','fri','sat','sun'].map(d=> (
          <button key={d} onClick={()=>toggleDay(d)} className={`p-3 border rounded ${availability[d] ? 'bg-emerald-50' : ''}`}>{d.toUpperCase()} {availability[d]?` ${availability[d].from}-${availability[d].to}`:''}</button>
        ))}
      </div>
      <div><button onClick={save} className="px-4 py-2 bg-emerald-600 text-white rounded">Save Availability</button></div>
    </div>
  )
}
