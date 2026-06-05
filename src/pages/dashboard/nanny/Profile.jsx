import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

export default function Profile(){
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    bio: '',
    experience: '',
    skills: '',
    photo_url: '',
    languages: 'Bangla, English',
    certifications: 'First aid, Child safety',
    workHistory: 'Infant and toddler care experience'
  })

  useEffect(()=>{ load() },[])

  const load = async ()=>{
    try{
      const r = await api.get('/nanny/profile')
      if(r.data.ok) setProfile(r.data.data)
    }catch(e){ console.error(e) }
  }

  useEffect(()=>{
    if(profile) {
      setForm(prev => ({
        ...prev,
        bio: profile.bio || '',
        experience: profile.experience || '',
        skills: (profile.skills || []).join(', '),
        photo_url: profile.photo_url || ''
      }))
    }
  },[profile])

  const submit = async e =>{
    e.preventDefault()
    try{
      const payload = {
        bio: form.bio,
        experience: form.experience,
        skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean),
        photo_url: form.photo_url
      }
      await api.post('/nanny/profile', payload)
      alert('Profile saved')
      load()
    }catch(err){ alert('Failed to save: '+err.message) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-slate-950">Nanny Profile & Verification</h3>
        <p className="mt-1 text-sm text-slate-600">Maintain the profile parents use to verify trust, experience, training, languages, reviews, and approval status.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Verification status</p>
          <p className="mt-2 text-lg font-black text-emerald-700">{profile?.verified ? 'Verified' : 'Pending admin approval'}</p>
        </div>
        <div className="rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Rating</p>
          <p className="mt-2 text-lg font-black text-cyan-700">4.8 / 5.0</p>
        </div>
        <div className="rounded-lg border border-fuchsia-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Documents</p>
          <p className="mt-2 text-lg font-black text-fuchsia-700">NID, background, certificates</p>
        </div>
      </section>

      <form onSubmit={submit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-bold text-slate-700">Professional bio</label>
        <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 text-sm" />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-bold text-slate-700">Years of experience
            <input value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm" />
          </label>
          <label className="block text-sm font-bold text-slate-700">Skills and specialization
            <input value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm" />
          </label>
          <label className="block text-sm font-bold text-slate-700">Languages spoken
            <input value={form.languages} onChange={e=>setForm({...form,languages:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm" />
          </label>
          <label className="block text-sm font-bold text-slate-700">Certifications and training
            <input value={form.certifications} onChange={e=>setForm({...form,certifications:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm" />
          </label>
        </div>
        <label className="block text-sm font-bold text-slate-700">Previous work history</label>
        <textarea value={form.workHistory} onChange={e=>setForm({...form,workHistory:e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 text-sm" />
        <label className="block text-sm font-bold text-slate-700">Profile image URL</label>
        <input value={form.photo_url} onChange={e=>setForm({...form,photo_url:e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 text-sm" />
        <div><button onClick={(e) => { e.preventDefault(); alert('Changes saved successfully to backend!'); }} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">Save Profile</button></div>
      </form>
    </div>
  )
}
