import React, { useMemo, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'

const items = [
  { label: 'Adoption Overview', path: '/dashboard/adoption' },
  { label: 'Orphanage Verification', path: '/dashboard/adoption#verification' },
  { label: 'Child Profiles', path: '/dashboard/adoption#children' },
  { label: 'Parent Profiles', path: '/dashboard/adoption#parents' },
  { label: 'Applications', path: '/dashboard/adoption#applications' },
  { label: 'Meetups & Bonding', path: '/dashboard/adoption#meetups' },
  { label: 'Evaluations', path: '/dashboard/adoption#evaluations' },
  { label: 'Compatibility', path: '/dashboard/adoption#compatibility' },
  { label: 'Final Approval', path: '/dashboard/adoption#approval' },
  { label: 'Follow-ups', path: '/dashboard/adoption#followups' },
  { label: 'Documents', path: '/dashboard/adoption#documents' },
  { label: 'Analytics', path: '/dashboard/adoption#analytics' },
  { label: 'Security', path: '/dashboard/adoption#security' },
  { label: 'Notifications', path: '/dashboard/adoption#notifications' },
]

const children = [
  {
    id: 'CH-204',
    name: 'Lucas',
    age: '4 years',
    gender: 'Male',
    status: 'Meetup Phase',
    medical: 'Healthy, routine check complete',
    traits: ['Curious', 'Social', 'Enjoys drawing'],
    visibility: 'Restricted',
  },
  {
    id: 'CH-218',
    name: 'Sofia',
    age: '6 years',
    gender: 'Female',
    status: 'Available',
    medical: 'Mild seasonal allergies',
    traits: ['Creative', 'Careful', 'Loves reading'],
    visibility: 'Verified parents only',
  },
  {
    id: 'CH-233',
    name: 'Marco',
    age: '3 years',
    gender: 'Male',
    status: 'Under Review',
    medical: 'Follow-up visit scheduled',
    traits: ['Playful', 'Energetic', 'Music interest'],
    visibility: 'Internal review',
  },
]

const applications = [
  { id: 'APP-1024', parent: 'Ariana Smith', child: 'Lucas', status: 'Evaluation Ongoing', documents: '6/7 uploaded', score: 84 },
  { id: 'APP-1025', parent: 'Daniel Carter', child: 'Sofia', status: 'Under Review', documents: '5/7 uploaded', score: 72 },
  { id: 'APP-1026', parent: 'Mina Rahman', child: 'Marco', status: 'Pending', documents: '3/7 uploaded', score: 61 },
]

const meetups = [
  { session: 1, child: 'Lucas', parent: 'Ariana Smith', date: '2026-05-25', attendance: 'Confirmed', note: 'Introductory play session' },
  { session: 2, child: 'Lucas', parent: 'Ariana Smith', date: '2026-05-29', attendance: 'Scheduled', note: 'Storytelling and drawing activity' },
  { session: 3, child: 'Sofia', parent: 'Daniel Carter', date: '2026-06-02', attendance: 'Pending', note: 'Reading activity and staff observation' },
]

const evaluations = [
  { label: 'Parent Q&A submitted', value: '8', detail: 'Session-based emotional responses collected' },
  { label: 'Child observations', value: '11', detail: 'Comfort, anxiety, and attachment notes logged' },
  { label: 'Open follow-ups', value: '3', detail: 'Staff review required before final approval' },
]

const parentProfiles = [
  { name: 'Ariana Smith', status: 'Verified', background: 'Married, stable home, early childhood volunteer', finance: 'Approved', preference: 'Age 3-5' },
  { name: 'Daniel Carter', status: 'Background Check', background: 'Single parent, extended family support', finance: 'Under Review', preference: 'Age 5-7' },
  { name: 'Mina Rahman', status: 'Documents Needed', background: 'Two-parent household, teacher profile', finance: 'Pending', preference: 'Age 2-4' },
]

const analytics = [
  ['Adoption success rate', '68%', 'Approved cases from completed evaluations'],
  ['Meetup completion', '74%', 'Scheduled bonding sessions completed'],
  ['Child welfare checks', '92%', 'Follow-up reports submitted on time'],
  ['Application review speed', '3.2 days', 'Average review cycle for new applications'],
]

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="scroll-mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function StatusBadge({ children, tone = 'slate' }) {
  const colors = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    violet: 'bg-violet-100 text-violet-700',
    red: 'bg-red-100 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
  }
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[tone]}`}>{children}</span>
}

export default function AdoptionDashboard() {
  const { user } = useAuth() || {}
  const [applicationStatus, setApplicationStatus] = useState('Evaluation Ongoing')
  const averageCompatibility = useMemo(() => {
    const total = applications.reduce((sum, item) => sum + item.score, 0)
    return Math.round(total / applications.length)
  }, [])

  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 md:flex">
      <Sidebar items={items} variant="adoption-workspace" />
      <main className="min-w-0 flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="rounded-lg border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-cyan-50 p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">Adoption Module</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Welcome, {user?.name || 'Orphanage Manager'}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Manage verified orphanage workflows, child profiles, parent applications, bonding sessions, compatibility review, final approval, and post-adoption follow-up from one secure dashboard.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ['Children Managed', children.length, 'green'],
            ['Active Applications', applications.length, 'violet'],
            ['Meetup Sessions', '10-12', 'yellow'],
            ['Avg Compatibility', `${averageCompatibility}%`, 'green'],
          ].map(([label, value, tone]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-600">{label}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
              <div className="mt-3"><StatusBadge tone={tone}>{label === 'Avg Compatibility' ? 'Hidden from parents' : 'Active'}</StatusBadge></div>
            </div>
          ))}
        </div>

        <Section id="verification" eyebrow="Step 1" title="Orphanage Registration & Verification">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3 text-sm text-slate-700">
              <p><strong>Organization:</strong> {user?.name || 'Registered Orphanage'}</p>
              <p><strong>Verification status:</strong> Documents submitted and awaiting admin verification.</p>
              <p><strong>Security:</strong> Registration documents are restricted to admin and authorized reviewers.</p>
            </div>
            <div className="rounded-lg bg-violet-50 p-4">
              <p className="font-bold text-slate-900">Required workflow</p>
              <p className="mt-2 text-sm text-slate-600">Document upload, admin verification, approval or rejection, and verified badge tracking.</p>
            </div>
          </div>
        </Section>

        <Section id="children" eyebrow="Step 2" title="Child Profile Management">
          <div className="grid gap-4 lg:grid-cols-3">
            {children.map(child => (
              <article key={child.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{child.name}</h3>
                    <p className="text-sm text-slate-600">{child.id} - {child.age} - {child.gender}</p>
                  </div>
                  <StatusBadge tone={child.status === 'Available' ? 'green' : child.status === 'Under Review' ? 'yellow' : 'violet'}>{child.status}</StatusBadge>
                </div>
                <p className="mt-3 text-sm text-slate-700">{child.medical}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {child.traits.map(trait => <StatusBadge key={trait}>{trait}</StatusBadge>)}
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-500">Visibility: {child.visibility}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="parents" eyebrow="Step 3" title="Parent Adoption Profiles">
          <div className="grid gap-4 lg:grid-cols-3">
            {parentProfiles.map(parent => (
              <article key={parent.name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-950">{parent.name}</h3>
                  <StatusBadge tone={parent.status === 'Verified' ? 'green' : parent.status === 'Background Check' ? 'yellow' : 'red'}>{parent.status}</StatusBadge>
                </div>
                <p className="mt-3 text-sm text-slate-600">{parent.background}</p>
                <div className="mt-4 grid gap-2 text-sm">
                  <p><strong>Financial stability:</strong> {parent.finance}</p>
                  <p><strong>Parenting preference:</strong> {parent.preference}</p>
                  <p><strong>Documents:</strong> Identity, family background, living condition, motivation letter</p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="applications" eyebrow="Step 4" title="Adoption Application System">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  {['Application', 'Parent', 'Child', 'Status', 'Documents', 'Internal Score'].map(head => (
                    <th key={head} className="px-4 py-3 font-bold">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-bold text-slate-900">{app.id}</td>
                    <td className="px-4 py-3">{app.parent}</td>
                    <td className="px-4 py-3">{app.child}</td>
                    <td className="px-4 py-3"><StatusBadge tone="violet">{app.status}</StatusBadge></td>
                    <td className="px-4 py-3">{app.documents}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{app.score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="meetups" eyebrow="Step 5" title="Meetup & Bonding Sessions">
          <div className="grid gap-3">
            {meetups.map(meetup => (
              <div key={`${meetup.child}-${meetup.session}`} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[100px_1fr_160px]">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">Session</p>
                  <p className="text-2xl font-black text-violet-600">{meetup.session}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">{meetup.parent} with {meetup.child}</p>
                  <p className="mt-1 text-sm text-slate-600">{meetup.note}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{meetup.date}</p>
                  <StatusBadge tone={meetup.attendance === 'Confirmed' ? 'green' : 'yellow'}>{meetup.attendance}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="evaluations" eyebrow="Steps 6-7" title="Parent Q&A and Child Observation Reports">
          <div className="grid gap-4 md:grid-cols-3">
            {evaluations.map(item => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-3xl font-black text-slate-950">{item.value}</p>
                <h3 className="mt-2 font-bold text-slate-900">{item.label}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm text-slate-700">
            Evaluation forms capture comfort level, communication quality, attachment signs, anxiety indicators, interaction quality, and staff observations after every meetup.
          </div>
        </Section>

        <Section id="compatibility" eyebrow="Step 8" title="Compatibility Matching Dashboard">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-bold text-slate-900">{app.parent} and {app.child}</p>
                    <span className="font-black text-violet-700">{app.score}%</span>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-slate-200">
                    <div className="h-3 rounded-full bg-violet-600" style={{ width: `${app.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-slate-950 p-5 text-white">
              <p className="font-bold">Private scoring rule</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Compatibility is hidden from parents and visible only to orphanage managers and admins. Scores combine meetup interaction, parent feedback, child observations, emotional trend, and document readiness.
              </p>
            </div>
          </div>
        </Section>

        <Section id="approval" eyebrow="Step 9" title="Final Adoption Approval">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div>
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Application decision stage</span>
                <select
                  value={applicationStatus}
                  onChange={event => setApplicationStatus(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {['Pending', 'Under Review', 'Meetup Phase', 'Evaluation Ongoing', 'Approved', 'Rejected'].map(status => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <p className="mt-3 text-sm text-slate-600">Current selected status: <strong>{applicationStatus}</strong></p>
            </div>
            <button className="rounded-lg bg-violet-600 px-5 py-3 font-bold text-white hover:bg-violet-700">
              Generate Final Report
            </button>
          </div>
        </Section>

        <Section id="followups" eyebrow="Step 10" title="Post-Adoption Follow-up">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['1 Month Check', 'Scheduled home visit, parent feedback, and child well-being report.'],
              ['3 Month Check', 'Safety verification, adjustment review, and risk flag update.'],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{detail}</p>
                <StatusBadge tone="green">Follow-up active</StatusBadge>
              </div>
            ))}
          </div>
        </Section>

        <Section id="documents" eyebrow="Security" title="Documentation, Privacy, and Notifications">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Secure Documents', 'Legal documents, identity papers, agreements, and reports are stored with restricted role access.'],
              ['Activity Logs', 'Admin and orphanage actions are tracked for audit, compliance, and suspicious activity review.'],
              ['Notifications', 'Meetup reminders, status changes, follow-up schedules, and emergency alerts are prepared here.'],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="analytics" eyebrow="Monitoring" title="Analytics & System Monitoring">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {analytics.map(([title, value, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-3xl font-black text-slate-950">{value}</p>
                <h3 className="mt-2 font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="security" eyebrow="Advanced Features" title="Security & Privacy Controls">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Encrypted storage', 'Legal, identity, medical, and evaluation files are marked for encrypted document storage.'],
              ['Role-based access', 'Parents see their own application data; compatibility scoring stays visible only to orphanage and admin roles.'],
              ['Sensitive data masking', 'Child medical summaries and restricted media use privacy-safe visibility controls.'],
              ['Audit trail', 'Verification, approvals, observations, and document actions are prepared for activity logging.'],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="notifications" eyebrow="Realtime Updates" title="Notification Center">
          <div className="space-y-3">
            {[
              ['Meetup reminder', 'Lucas session 2 reminder scheduled for May 29, 2026.'],
              ['Application update', 'APP-1025 moved to Under Review.'],
              ['Follow-up schedule', 'One-month welfare check is ready to assign.'],
              ['Emergency alert', 'Risk flag workflow is available for urgent child safety review.'],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-lg border-l-4 border-violet-500 bg-violet-50 p-4">
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  )
}
