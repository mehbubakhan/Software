import React, { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const items = [
  { label: 'Admission', path: '/dashboard/parent/admission' },
  { label: 'Activities', path: '/dashboard/parent/activities' },
  { label: 'Packages', path: '/dashboard/parent/packages' },
  { label: 'CCTV Demo', path: '/dashboard/parent/cctv' },
  { label: 'GPS Demo', path: '/dashboard/parent/gps' }
]

const activities = [
  { time: '09:10 AM', title: 'Arrival', detail: 'Checked in with a smile and joined morning circle.', tone: 'bg-cyan-500' },
  { time: '10:35 AM', title: 'Snack', detail: 'Finished fruit, milk, and crackers.', tone: 'bg-emerald-500' },
  { time: '12:20 PM', title: 'Nap', detail: 'Resting quietly after story time.', tone: 'bg-violet-500' },
  { time: '02:45 PM', title: 'Creative Play', detail: 'Painted shapes and practiced color names.', tone: 'bg-rose-500' }
]

const packages = [
  { name: 'Half Day', price: '$180', detail: 'Morning or afternoon care with snacks.', features: ['4 hours daily', 'Activity updates', 'Pickup notes'] },
  { name: 'Full Day', price: '$320', detail: 'Complete weekday care for busy families.', features: ['8 hours daily', 'Meals included', 'Daily activity report'] },
  { name: 'Premium', price: '$460', detail: 'Full care plus live demo tools and transport.', features: ['CCTV demo access', 'GPS demo access', 'Priority admission'] }
]

function SectionHeader({ label, title, children }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-fuchsia-500">{label}</p>
      <h2 className="mt-2 text-3xl font-black text-slate-950">{title}</h2>
      {children && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{children}</p>}
    </div>
  )
}

function Panel({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-cyan-900/5 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  )
}

function AdmissionView() {
  const [form, setForm] = useState({ childName: '', dob: '', note: '' })
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      await api.post('/admissions/apply', { childName: form.childName, dob: form.dob || null })
      setStatus('success')
      setMessage('Admission request submitted. Status: pending review.')
      setForm({ childName: '', dob: '', note: '' })
    } catch (err) {
      setStatus('error')
      setMessage(err.response?.data?.message || err.response?.data?.error || err.message || 'Admission request failed')
    }
  }

  return (
    <>
      <SectionHeader label="Admission" title="Submit an admission request">
        Add your child details and send the request to the daycare admin for review.
      </SectionHeader>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-black text-slate-700">Child Name</span>
              <input className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-cyan-400" value={form.childName} onChange={e => setForm({ ...form, childName: e.target.value })} required />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Date of Birth</span>
              <input type="date" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-cyan-400" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Parent Note</span>
              <textarea className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-cyan-400" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Allergies, pickup preferences, or care notes" />
            </label>
            <button type="submit" disabled={status === 'loading'} className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 font-black text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
              {status === 'loading' ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
          {message && <p className={`mt-4 text-sm font-bold ${status === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>{message}</p>}
        </Panel>
        <Panel>
          <h3 className="text-lg font-black text-slate-950">Current Progress</h3>
          <div className="mt-5 space-y-4">
            {['Request sent', 'Admin review', 'Package selection', 'Start date'].map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-black text-white ${index === 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}>{index + 1}</span>
                <span className="font-bold text-slate-700">{step}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}

function ActivitiesView() {
  return (
    <>
      <SectionHeader label="Activities" title="Today’s child activity">
        Review the daily timeline that care staff share throughout the day.
      </SectionHeader>
      <Panel>
        <div className="space-y-5">
          {activities.map(item => (
            <div key={`${item.time}-${item.title}`} className="grid gap-3 border-b border-slate-100 pb-5 last:border-0 last:pb-0 sm:grid-cols-[110px_1fr]">
              <p className="text-sm font-black text-slate-500">{item.time}</p>
              <div className="flex gap-4">
                <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${item.tone}`} />
                <div>
                  <h3 className="font-black text-slate-950">{item.title}</h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

function PackagesView() {
  const [selected, setSelected] = useState('Full Day')
  return (
    <>
      <SectionHeader label="Packages" title="Choose a care package">
        Compare available plans and keep the selected option visible for admission follow-up.
      </SectionHeader>
      <div className="grid gap-5 lg:grid-cols-3">
        {packages.map(plan => (
          <button key={plan.name} onClick={() => setSelected(plan.name)} className={`rounded-2xl border p-5 text-left shadow-lg transition hover:-translate-y-1 ${selected === plan.name ? 'border-cyan-300 bg-cyan-50 shadow-cyan-900/10' : 'border-white/70 bg-white/80 shadow-cyan-900/5'}`}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-black text-slate-950">{plan.name}</h3>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-black text-white">{plan.price}</span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{plan.detail}</p>
            <ul className="mt-5 space-y-2">
              {plan.features.map(feature => <li key={feature} className="text-sm font-bold text-slate-700">{feature}</li>)}
            </ul>
          </button>
        ))}
      </div>
      <p className="mt-5 text-sm font-black text-cyan-700">Selected package: {selected}</p>
    </>
  )
}

function CctvView() {
  const [camera, setCamera] = useState('Playroom')
  return (
    <>
      <SectionHeader label="CCTV Demo" title="Live room preview">
        Switch between demo cameras for a parent-friendly view of daycare spaces.
      </SectionHeader>
      <Panel>
        <div className="flex flex-wrap gap-2">
          {['Playroom', 'Nap Room', 'Outdoor'].map(name => (
            <button key={name} onClick={() => setCamera(name)} className={`rounded-full px-4 py-2 text-sm font-black transition ${camera === name ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-cyan-100'}`}>{name}</button>
          ))}
        </div>
        <div className="mt-5 aspect-video overflow-hidden rounded-2xl bg-slate-950 p-4 text-white">
          <div className="flex h-full flex-col justify-between rounded-xl border border-white/15 bg-[radial-gradient(circle_at_30%_25%,rgba(34,211,238,0.35),transparent_28%),radial-gradient(circle_at_70%_70%,rgba(244,114,182,0.28),transparent_30%),linear-gradient(135deg,#0f172a,#111827)] p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-black uppercase tracking-[0.16em]">Live</span>
              <span className="text-sm font-black">{camera}</span>
            </div>
            <div>
              <div className="mb-4 h-24 w-24 rounded-full bg-white/10 blur-sm" />
              <p className="text-2xl font-black">Demo camera feed</p>
              <p className="mt-1 text-sm font-semibold text-slate-300">Preview only</p>
            </div>
          </div>
        </div>
      </Panel>
    </>
  )
}

function GpsView() {
  const stops = useMemo(() => ['Daycare', 'Main Road', 'Maple Avenue', 'Home'], [])
  return (
    <>
      <SectionHeader label="GPS Demo" title="Transport route tracker">
        See a simple route preview for pickup and drop-off coordination.
      </SectionHeader>
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Panel className="min-h-[360px]">
          <div className="relative h-80 overflow-hidden rounded-2xl bg-emerald-50">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[length:44px_44px]" />
            <div className="absolute left-[18%] top-[62%] h-3 w-[62%] rotate-[-18deg] rounded-full bg-cyan-500" />
            <div className="absolute left-[19%] top-[62%] grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">D</div>
            <div className="absolute right-[16%] top-[38%] grid h-11 w-11 place-items-center rounded-full bg-fuchsia-500 text-sm font-black text-white">H</div>
            <div className="absolute left-[50%] top-[49%] grid h-12 w-12 place-items-center rounded-full bg-white text-2xl shadow-xl">↗</div>
          </div>
        </Panel>
        <Panel>
          <h3 className="text-lg font-black text-slate-950">Route Stops</h3>
          <div className="mt-5 space-y-4">
            {stops.map((stop, index) => (
              <div key={stop} className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${index < 2 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <div>
                  <p className="font-black text-slate-800">{stop}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{index < 2 ? 'Completed' : 'Upcoming'}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}

export default function ParentDashboard() {
  return (
    <div className="min-h-[calc(100vh-68px)] md:flex">
      <Sidebar items={items} variant="parent-workspace" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route index element={<Navigate to="admission" replace />} />
          <Route path="admission" element={<AdmissionView />} />
          <Route path="activities" element={<ActivitiesView />} />
          <Route path="packages" element={<PackagesView />} />
          <Route path="cctv" element={<CctvView />} />
          <Route path="gps" element={<GpsView />} />
        </Routes>
      </main>
    </div>
  )
}
