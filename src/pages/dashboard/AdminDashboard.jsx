import React from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'

const items = [
  {label:'Overview', path:'/dashboard/admin'},
  {label:'Admissions', path:'/dashboard/admin#admissions'},
  {label:'Children', path:'/dashboard/admin#children'},
  {label:'Attendance', path:'/dashboard/admin#attendance'},
  {label:'Activities', path:'/dashboard/admin#activities'},
  {label:'Communication', path:'/dashboard/admin#communication'},
  {label:'Safety', path:'/dashboard/admin#safety'},
  {label:'Transport', path:'/dashboard/admin#transport'},
  {label:'CCTV', path:'/dashboard/admin#cctv'},
  {label:'Health', path:'/dashboard/admin#health'},
  {label:'Feedback', path:'/dashboard/admin#feedback'}
]

const metrics = [
  ['Admission requests', '12', '4 need review'],
  ['Checked in today', '38', '2 late pickups'],
  ['Active alerts', '3', '1 safety incident'],
  ['Transport routes', '5', '2 delayed']
]

const modules = [
  {
    id: 'registration',
    title: 'Daycare Registration & Verification',
    text: 'Manage daycare profile, licenses, contact information, facility details, operating hours, emergency contacts, and system admin verification status.',
    actions: ['Profile creation', 'License upload', 'Facility details', 'Verification status']
  },
  {
    id: 'search',
    title: 'Parent Search & Discovery',
    text: 'Keep daycare details searchable by location, ratings, fees, seats, CCTV, transport, supported ages, facilities, and special care services.',
    actions: ['Available seats', 'Fees and ratings', 'Facilities', 'Advanced filters']
  },
  {
    id: 'admissions',
    title: 'Child Admission Management',
    text: 'Review online admission forms, child documents, vaccination records, emergency contacts, and approve or reject applications.',
    actions: ['Pending applications', 'Documents', 'Vaccination records', 'Approval workflow']
  },
  {
    id: 'activities',
    title: 'Daily Activity Tracking',
    text: 'Send parent updates for meals, sleep, bathroom, playtime, learning activities, mood tracking, and child status.',
    actions: ['Meal update', 'Sleep log', 'Mood tracking', 'Learning activity']
  },
  {
    id: 'attendance',
    title: 'Attendance Management',
    text: 'Track child check-in/check-out, history, absence notifications, late pickup alerts, QR scans, and RFID-style attendance.',
    actions: ['Check in', 'Check out', 'Late pickup alert', 'Attendance history']
  },
  {
    id: 'communication',
    title: 'Parent Communication',
    text: 'Send in-app messages, announcements, event reminders, notifications, and emergency communication to parents.',
    actions: ['Messages', 'Announcements', 'Event reminders', 'Emergency notes']
  },
  {
    id: 'safety',
    title: 'Child Safety Monitoring',
    text: 'Monitor live child status, safety alerts, incident reports, emergency notifications, and pickup authorization.',
    actions: ['Pickup authorization', 'Incident report', 'Safety alert', 'Emergency escalation']
  },
  {
    id: 'transport',
    title: 'Transport Tracking',
    text: 'Coordinate GPS bus tracking, route monitoring, pickup/drop notifications, delay alerts, and live location integration.',
    actions: ['Routes', 'Live location', 'Pickup notice', 'Delay alert']
  },
  {
    id: 'cctv',
    title: 'CCTV Monitoring',
    text: 'Provide simulated camera feeds, snapshots, restricted viewing windows, and secure parent access for transparency.',
    actions: ['Live feed', 'Snapshots', 'Viewing hours', 'Secure access']
  },
  {
    id: 'health',
    title: 'Meal & Health Reporting',
    text: 'Track meal records, allergies, medicine reminders, temperature logs, health notes, and emergency medical information.',
    actions: ['Allergies', 'Medicine reminders', 'Temperature log', 'Medical notes']
  },
  {
    id: 'feedback',
    title: 'Feedback & Ratings',
    text: 'Review parent ratings, complaints, service feedback, reports, and parent satisfaction analytics.',
    actions: ['Ratings', 'Reviews', 'Complaints', 'Satisfaction']
  }
]

const activityRows = [
  ['Ate lunch at 1:00 PM', 'Meal', 'Sent to parent'],
  ['Slept for 2 hours', 'Sleep', 'Logged'],
  ['Participated in drawing activity', 'Learning', 'Shared'],
  ['Unauthorized pickup attempt blocked', 'Safety', 'Escalated']
]

export default function AdminDashboard(){
  const { user } = useAuth() || {}
  const isDaycare = user?.role === 'daycare'

  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 md:flex">
      <Sidebar items={items} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <section className="mb-6 rounded-lg border border-white bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">BabyCare+ SafeGuard</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">
            {isDaycare ? 'Daycare admin dashboard' : 'System admin dashboard'}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Manage daycare registration, admissions, child records, attendance, daily reports, parent communication, safety monitoring, transport, CCTV, health logs, and feedback.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {metrics.map(([label, value, note]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-cyan-700">{value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">{note}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-lg border border-red-100 bg-red-50 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-red-600">Emergency desk</p>
              <h3 className="mt-1 text-xl font-black text-slate-950">Fire, medical, pickup, and incident alerts</h3>
              <p className="mt-1 text-sm text-slate-600">Send one-click SOS alerts to parents and admins, block unauthorized pickup, and log incident reports.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500">Trigger SOS</button>
              <button className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 hover:border-red-400">Report Incident</button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-950">Live child activity feed</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-2 pr-4">Update</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-800">
                  {activityRows.map(row => (
                    <tr key={row.join('-')} className="border-t">
                      {row.map(cell => <td key={cell} className="py-3 pr-4">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-950">Simulated CCTV & transport</h3>
            <div className="mt-4 grid gap-3">
              <div className="rounded-lg bg-slate-950 p-4 text-white">
                <p className="text-sm font-bold text-cyan-200">Camera 01 - Toddler room</p>
                <div className="mt-3 h-28 rounded bg-slate-800" />
                <p className="mt-2 text-xs text-slate-300">Restricted viewing window: 10:00 AM - 2:00 PM</p>
              </div>
              <div className="rounded-lg border border-cyan-200 bg-white p-4">
                <p className="font-bold text-slate-950">Bus Route A</p>
                <p className="mt-1 text-sm text-slate-600">Live location active, 8 minutes delay, next stop: Lake Road.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map(module => (
            <article key={module.id} id={module.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-black text-slate-950">{module.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{module.text}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {module.actions.map(action => (
                  <span key={action} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                    {action}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
