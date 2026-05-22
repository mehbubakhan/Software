import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

export default function Availability(){
  const [availability, setAvailability] = useState({})
  const [serviceType, setServiceType] = useState('part_time')
  const [hourlyRate, setHourlyRate] = useState('15')

  useEffect(()=>{ load() },[])

  const load = async ()=>{
    try{
      const r = await api.get('/nanny/availability')
      if(r.data.ok) setAvailability(r.data.data || {})
    }catch(e){ console.error(e) }
  }

  const save = async ()=>{
    try{
      await api.post('/nanny/availability', { availability })
      alert(`Availability saved for ${serviceType.replace('_', ' ')} at ${hourlyRate}/hour`)
    }catch(e){ alert('Failed: '+e.message) }
  }

  const toggleDay = day => {
    setAvailability(prev=>({ ...prev, [day]: prev[day]?null:{ from:'09:00', to:'17:00' } }))
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-slate-950">Schedule & Availability</h3>
        <p className="mt-1 text-sm text-slate-600">Set service type, hourly rate, weekly schedule, and booking time slots for parent requests.</p>
      </div>
      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <label className="block text-sm font-bold text-slate-700">Service type
          <select value={serviceType} onChange={e=>setServiceType(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="hourly">Hourly</option>
          </select>
        </label>
        <label className="block text-sm font-bold text-slate-700">Service price per hour
          <input value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </label>
      </section>
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3 lg:grid-cols-7">
        {['mon','tue','wed','thu','fri','sat','sun'].map(d=> (
          <button key={d} onClick={()=>toggleDay(d)} className={`rounded-lg border p-3 text-sm font-bold ${availability[d] ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'}`}>{d.toUpperCase()} {availability[d]?` ${availability[d].from}-${availability[d].to}`:''}</button>
        ))}
      </div>
      <div><button onClick={save} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">Save Availability</button></div>
    </div>
  )
}
