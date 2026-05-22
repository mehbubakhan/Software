import React, { useState } from 'react'
import api from '../../../services/api'
import SOSButton from '../../../components/SOSButton'

export default function Safety(){
  const [note, setNote] = useState('')
  const [emergencyType, setEmergencyType] = useState('medical')
  const [locationStatus, setLocationStatus] = useState('Waiting for GPS permission')
  const [safeZone, setSafeZone] = useState('Home safe zone')

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported in this browser')
      return
    }
    setLocationStatus('Requesting current location...')
    navigator.geolocation.getCurrentPosition(
      position => setLocationStatus(`Lat ${position.coords.latitude.toFixed(5)}, Lng ${position.coords.longitude.toFixed(5)}`),
      error => setLocationStatus(error.message)
    )
  }

  const submit = async ()=>{
    try{
      await api.post('/safety/respond', { check_id: Date.now(), response: 'ok', note })
      alert('Response recorded')
    }catch(e){ alert('Failed: '+e.message) }
  }
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-slate-950">Safety Monitoring</h3>
        <p className="mt-1 text-sm text-slate-600">Smart safety checks, missed response escalation, GPS status, safe zone monitoring, and emergency SOS.</p>
      </div>

      <section className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700">Smart safety check</p>
        <h4 className="mt-2 text-lg font-black text-slate-950">Are you and the child safe?</h4>
        <textarea value={note} onChange={e=>setNote(e.target.value)} className="mt-3 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="Optional note for parent/admin" />
        <div className="mt-3 flex flex-wrap gap-3">
          <button onClick={submit} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">Confirm Safe</button>
          <button className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800">Mark Delayed Response</button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
          <h4 className="font-black text-slate-950">GPS and safe zone</h4>
          <p className="mt-2 text-sm text-slate-600">{locationStatus}</p>
          <label className="mt-4 block text-sm font-bold text-slate-700">
            Safe zone
            <select value={safeZone} onChange={e=>setSafeZone(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
              <option>Home safe zone</option>
              <option>School safe zone</option>
              <option>Park approved route</option>
            </select>
          </label>
          <button onClick={getLocation} className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-500">Share Current Location</button>
        </div>

        <div className="rounded-lg border border-red-100 bg-red-50 p-5 shadow-sm">
          <h4 className="font-black text-slate-950">Emergency SOS</h4>
          <label className="mt-4 block text-sm font-bold text-slate-700">
            Emergency type
            <select value={emergencyType} onChange={e=>setEmergencyType(e.target.value)} className="mt-2 w-full rounded-lg border border-red-200 px-3 py-2">
              <option value="medical">Medical emergency</option>
              <option value="lost_child">Lost child</option>
              <option value="accident">Accident</option>
              <option value="unsafe_environment">Unsafe environment</option>
            </select>
          </label>
          <p className="mt-3 text-sm text-slate-600">SOS notifies parent, admin, and emergency contacts with the latest available location.</p>
          <div className="mt-4">
            <SOSButton />
          </div>
        </div>
      </section>
    </div>
  )
}
