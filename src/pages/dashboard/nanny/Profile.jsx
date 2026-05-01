import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

export default function Profile(){
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ bio:'', experience:'', skills:'', photo_url:'' })
  useEffect(()=>{ load() },[])
  const load = async ()=>{
    try{ const r = await api.get('/nanny/profile'); if(r.data.ok) setProfile(r.data.data) }catch(e){ console.error(e) }
  }
  useEffect(()=>{ if(profile) setForm({ bio: profile.bio||'', experience: profile.experience||'', skills: (profile.skills||[]).join(', '), photo_url: profile.photo_url||'' }) },[profile])
  const submit = async e =>{ e.preventDefault(); try{ const payload = { bio: form.bio, experience: form.experience, skills: form.skills.split(',').map(s=>s.trim()), photo_url: form.photo_url }; await api.post('/nanny/profile', payload); alert('Profile saved'); load() }catch(err){ alert('Failed to save: '+err.message) }}
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">My Profile</h3>
      <form onSubmit={submit} className="space-y-3">
        <label className="block text-sm">Bio</label>
        <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} className="w-full p-2 border rounded" />
        <label className="block text-sm">Experience</label>
        <input value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} className="w-full p-2 border rounded" />
        <label className="block text-sm">Skills (comma separated)</label>
        <input value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} className="w-full p-2 border rounded" />
        <label className="block text-sm">Photo URL</label>
        <input value={form.photo_url} onChange={e=>setForm({...form,photo_url:e.target.value})} className="w-full p-2 border rounded" />
        <div><button className="px-4 py-2 bg-emerald-600 text-white rounded">Save Profile</button></div>
      </form>
    </div>
  )
}
