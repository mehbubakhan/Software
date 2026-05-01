import React, { useMemo, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

const items = [
  { label: 'Overview', path: '/dashboard/orphanage-manager' },
  { label: 'Profile', path: '/dashboard/orphanage-manager/profile' },
  { label: 'Children', path: '/dashboard/orphanage-manager/children' },
  { label: 'Applications', path: '/dashboard/orphanage-manager/applications' },
  { label: 'Meetups', path: '/dashboard/orphanage-manager/meetups' },
  { label: 'Observations', path: '/dashboard/orphanage-manager/observations' },
  { label: 'Parent Q&A', path: '/dashboard/orphanage-manager/qa' },
  { label: 'Compatibility', path: '/dashboard/orphanage-manager/compatibility' },
  { label: 'Approvals', path: '/dashboard/orphanage-manager/approvals' },
  { label: 'Follow-Ups', path: '/dashboard/orphanage-manager/follow-ups' }
]

const children = [
  { name: 'Ari Khan', age: 6, health: 'Stable', background: 'Enjoys drawing, early reader', status: 'Meetups active' },
  { name: 'Mira Das', age: 4, health: 'Routine check due', background: 'Quiet first, warms up with music', status: 'Profile review' },
  { name: 'Nabil Roy', age: 8, health: 'Stable', background: 'Loves football and puzzles', status: 'Application match' }
]

const applications = [
  { parent: 'Sarah & Imran', child: 'Ari Khan', readiness: 'High', stage: 'Meetup 7 of 12' },
  { parent: 'Nadia Rahman', child: 'Nabil Roy', readiness: 'Review', stage: 'Questionnaire' },
  { parent: 'Toma Biswas', child: 'Mira Das', readiness: 'New', stage: 'Background check' }
]

const meetups = [
  { session: 1, focus: 'Introduction', status: 'Complete' },
  { session: 2, focus: 'Guided play', status: 'Complete' },
  { session: 3, focus: 'Shared activity', status: 'Complete' },
  { session: 4, focus: 'Meal routine', status: 'Complete' },
  { session: 5, focus: 'Outdoor time', status: 'Complete' },
  { session: 6, focus: 'Story and reflection', status: 'Complete' },
  { session: 7, focus: 'Independent bonding', status: 'Scheduled' },
  { session: 8, focus: 'Caregiving practice', status: 'Planned' },
  { session: 9, focus: 'Home transition talk', status: 'Planned' },
  { session: 10, focus: 'Final review', status: 'Planned' },
  { session: 11, focus: 'Optional comfort visit', status: 'Optional' },
  { session: 12, focus: 'Optional closure visit', status: 'Optional' }
]

function Header({ label, title, children }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-600">{label}</p>
      <h2 className="mt-2 text-3xl font-black text-slate-950">{title}</h2>
      {children && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{children}</p>}
    </div>
  )
}

function Panel({ children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-white/70 bg-white/85 p-5 shadow-lg shadow-violet-900/5 backdrop-blur-xl ${className}`}>
      {children}
    </section>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      {children}
    </label>
  )
}

function TextInput(props) {
  return <input {...props} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-violet-400" />
}

function TextArea(props) {
  return <textarea {...props} className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-violet-400" />
}

function Overview() {
  const metrics = [
    { label: 'Child Profiles', value: '24', detail: '3 updated this week', color: 'from-violet-500 to-fuchsia-500' },
    { label: 'Applications', value: '12', detail: '5 ready for review', color: 'from-cyan-500 to-blue-500' },
    { label: 'Meetups', value: '7/12', detail: 'Active case progress', color: 'from-emerald-500 to-teal-500' },
    { label: 'Follow-Ups', value: '4', detail: 'Scheduled after adoption', color: 'from-amber-400 to-orange-500' }
  ]

  return (
    <>
      <Header label="Orphanage Manager" title="Adoption care command center">
        Manage orphanage visibility, child records, parent applications, structured meetups, approvals, and post-adoption follow-ups from one focused dashboard.
      </Header>
      <div className="grid gap-5 lg:grid-cols-4">
        {metrics.map(item => (
          <Panel key={item.label}>
            <span className={`mb-5 block h-2 w-20 rounded-full bg-gradient-to-r ${item.color}`} />
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
            <h3 className="mt-3 text-3xl font-black text-slate-950">{item.value}</h3>
            <p className="mt-2 text-sm font-bold text-slate-500">{item.detail}</p>
          </Panel>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <h3 className="text-lg font-black text-slate-950">Active Adoption Pipeline</h3>
          <div className="mt-5 space-y-4">
            {applications.map(app => (
              <div key={`${app.parent}-${app.child}`} className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-[1fr_150px]">
                <div>
                  <p className="font-black text-slate-900">{app.parent}</p>
                  <p className="text-sm font-semibold text-slate-600">{app.child} - {app.stage}</p>
                </div>
                <span className="self-start rounded-full bg-white px-3 py-1 text-center text-xs font-black uppercase tracking-[0.12em] text-violet-700">{app.readiness}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h3 className="text-lg font-black text-slate-950">Manager Checklist</h3>
          <div className="mt-5 space-y-4">
            {['Profile trust details updated', 'Child records reviewed', 'Parent Q&A collected', 'Compatibility hidden from applicants', 'Follow-up calendar checked'].map((task, index) => (
              <div key={task} className="flex items-center gap-3">
                <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black text-white ${index < 3 ? 'bg-emerald-500' : 'bg-slate-300'}`}>{index + 1}</span>
                <span className="font-bold text-slate-700">{task}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}

function Profile() {
  const [form, setForm] = useState({
    name: 'Hope Bridge Orphanage',
    location: 'Dhaka',
    contact: '+880 1700 000000',
    facilities: 'Library, clinic room, play yard, counseling room',
    mission: 'Provide stable care and prepare every child for a safe, loving family.'
  })

  return (
    <>
      <Header label="Orphanage Profile" title="Build trust with a complete profile">
        Keep location, facilities, mission, and contact information clear for prospective adoptive parents.
      </Header>
      <Panel>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Orphanage Name"><TextInput value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Location"><TextInput value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></Field>
          <Field label="Contact"><TextInput value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} /></Field>
          <Field label="Facilities"><TextInput value={form.facilities} onChange={e => setForm({ ...form, facilities: e.target.value })} /></Field>
          <div className="lg:col-span-2">
            <Field label="Mission"><TextArea value={form.mission} onChange={e => setForm({ ...form, mission: e.target.value })} /></Field>
          </div>
        </div>
        <button className="mt-5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3 font-black text-white shadow-lg shadow-violet-500/20">Save Profile</button>
      </Panel>
    </>
  )
}

function Children() {
  return (
    <>
      <Header label="Child Profiles" title="Add and manage secure child records">
        Track basic details, health, background, photos, and regular updates as each child grows and progresses.
      </Header>
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Panel>
          <h3 className="text-lg font-black text-slate-950">Add Child Profile</h3>
          <div className="mt-4 space-y-4">
            <Field label="Child Name"><TextInput placeholder="Full name" /></Field>
            <Field label="Age"><TextInput type="number" min="0" placeholder="Age" /></Field>
            <Field label="Health Notes"><TextArea placeholder="Health, allergies, medical follow-ups" /></Field>
            <Field label="Background"><TextArea placeholder="Family history, strengths, needs, education notes" /></Field>
            <Field label="Photo URL"><TextInput placeholder="https://..." /></Field>
          </div>
          <button className="mt-5 w-full rounded-xl bg-slate-950 px-5 py-3 font-black text-white">Add Record</button>
        </Panel>
        <Panel>
          <h3 className="text-lg font-black text-slate-950">Managed Children</h3>
          <div className="mt-5 space-y-4">
            {children.map(child => (
              <div key={child.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-black text-slate-950">{child.name}</p>
                    <p className="text-sm font-semibold text-slate-600">Age {child.age} - {child.health}</p>
                  </div>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">{child.status}</span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{child.background}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}

function Applications() {
  return (
    <>
      <Header label="Applications" title="Review prospective parent applications">
        Compare applicants by readiness, child preference, stage, and background review status.
      </Header>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                <th className="py-3">Applicant</th>
                <th className="py-3">Child</th>
                <th className="py-3">Readiness</th>
                <th className="py-3">Stage</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.parent} className="border-b border-slate-100 last:border-0">
                  <td className="py-4 font-black text-slate-900">{app.parent}</td>
                  <td className="py-4 font-semibold text-slate-600">{app.child}</td>
                  <td className="py-4 font-semibold text-slate-600">{app.readiness}</td>
                  <td className="py-4 font-semibold text-slate-600">{app.stage}</td>
                  <td className="py-4"><button className="rounded-lg bg-violet-100 px-3 py-2 text-sm font-black text-violet-700">Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

function Meetups() {
  const completed = meetups.filter(item => item.status === 'Complete').length
  return (
    <>
      <Header label="Meetups" title="Schedule and track 10-12 bonding sessions">
        Structure repeated meetings between the child and prospective parents to build comfort before adoption.
      </Header>
      <Panel>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-black text-slate-900">{completed} completed, {meetups.length - completed} remaining or optional</p>
          <button className="rounded-xl bg-slate-950 px-4 py-2 font-black text-white">Schedule Meetup</button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {meetups.map(item => (
            <div key={item.session} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Session {item.session}</p>
              <h3 className="mt-2 font-black text-slate-950">{item.focus}</h3>
              <p className={`mt-3 text-sm font-black ${item.status === 'Complete' ? 'text-emerald-600' : item.status === 'Scheduled' ? 'text-violet-600' : 'text-slate-500'}`}>{item.status}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

function Observations() {
  return (
    <>
      <Header label="Observations" title="Record child behavior after interactions">
        Capture comfort level, emotions, and behavior notes after every meetup or important interaction.
      </Header>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <div className="space-y-4">
            <Field label="Child"><TextInput placeholder="Child name" /></Field>
            <Field label="Meetup Session"><TextInput type="number" min="1" max="12" placeholder="1-12" /></Field>
            <Field label="Comfort Level"><TextInput placeholder="Calm, hesitant, engaged..." /></Field>
            <Field label="Observation"><TextArea placeholder="Behavior, emotions, attachment signals, concerns" /></Field>
          </div>
          <button className="mt-5 w-full rounded-xl bg-violet-600 px-5 py-3 font-black text-white">Save Observation</button>
        </Panel>
        <Panel>
          <h3 className="text-lg font-black text-slate-950">Recent Notes</h3>
          {['Ari smiled during shared drawing and asked for another visit.', 'Mira stayed close to staff at first, then joined music activity.', 'Nabil asked thoughtful questions about home routines.'].map(note => (
            <p key={note} className="mt-4 rounded-xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-600">{note}</p>
          ))}
        </Panel>
      </div>
    </>
  )
}

function ParentQa() {
  const questions = ['Why do you want to adopt?', 'How do you handle stress at home?', 'What support system will help the child?', 'How will you preserve the child history and identity?']
  return (
    <>
      <Header label="Parent Q&A" title="Collect guided parent responses">
        Review answers that reveal intentions, parenting style, preparation, and compatibility.
      </Header>
      <Panel>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Field key={question} label={`${index + 1}. ${question}`}>
              <TextArea placeholder="Parent response" />
            </Field>
          ))}
        </div>
        <button className="mt-5 rounded-xl bg-slate-950 px-5 py-3 font-black text-white">Save Q&A</button>
      </Panel>
    </>
  )
}

function Compatibility() {
  const scores = useMemo(() => [
    { pair: 'Ari Khan + Sarah & Imran', score: 87, reason: 'Strong play comfort and consistent parent answers' },
    { pair: 'Nabil Roy + Nadia Rahman', score: 74, reason: 'Good values alignment, more meetup data needed' },
    { pair: 'Mira Das + Toma Biswas', score: 62, reason: 'Early stage, limited observation history' }
  ], [])

  return (
    <>
      <Header label="Hidden Indicator" title="Internal compatibility guidance">
        Use this private score as a decision-support tool. It is visible only to managers and should not be shown to applicants.
      </Header>
      <Panel>
        <div className="space-y-4">
          {scores.map(item => (
            <div key={item.pair} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-black text-slate-950">{item.pair}</p>
                <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">{item.score}%</span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${item.score}%` }} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-600">{item.reason}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

function Approvals() {
  return (
    <>
      <Header label="Approval" title="Approve adoption when every step is complete">
        Confirm profile review, meetings, observations, Q&A, and compatibility review before formal approval.
      </Header>
      <Panel>
        <div className="grid gap-4 md:grid-cols-2">
          {['Background review complete', '10+ meetups completed', 'Observation notes reviewed', 'Parent Q&A accepted', 'Compatibility reviewed', 'Follow-up schedule created'].map((item, index) => (
            <label key={item} className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 font-bold text-slate-700">
              <input type="checkbox" defaultChecked={index < 4} className="h-5 w-5 accent-violet-600" />
              {item}
            </label>
          ))}
        </div>
        <button className="mt-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 font-black text-white shadow-lg shadow-emerald-500/20">Approve Adoption Process</button>
      </Panel>
    </>
  )
}

function FollowUps() {
  const checks = ['7-day home adjustment call', '30-day wellbeing visit', '90-day school and health review', '180-day family stability check']
  return (
    <>
      <Header label="Follow-Ups" title="Monitor wellbeing after adoption">
        Keep scheduled checks visible so the transition remains stable and supportive after placement.
      </Header>
      <Panel>
        <div className="space-y-4">
          {checks.map((check, index) => (
            <div key={check} className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-[110px_1fr_120px]">
              <p className="font-black text-violet-700">Check {index + 1}</p>
              <p className="font-bold text-slate-700">{check}</p>
              <button className="rounded-lg bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm">Record</button>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

export default function OrphanageManagerDashboard() {
  return (
    <div className="min-h-[calc(100vh-68px)] md:flex">
      <Sidebar items={items} />
      <main className="flex-1 bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="children" element={<Children />} />
          <Route path="applications" element={<Applications />} />
          <Route path="meetups" element={<Meetups />} />
          <Route path="observations" element={<Observations />} />
          <Route path="qa" element={<ParentQa />} />
          <Route path="compatibility" element={<Compatibility />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="follow-ups" element={<FollowUps />} />
        </Routes>
      </main>
    </div>
  )
}
