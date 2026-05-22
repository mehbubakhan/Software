import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import Overview from './parent/Overview'
import HireNanny from './parent/HireNanny'
import DaycareManagement from './parent/DaycareManagement'
import SafetyMonitoring from './parent/SafetyMonitoring'
import LearningPlatform from './parent/LearningPlatform'
import Marketplace from './parent/Marketplace'
import AdoptionSystem from './parent/AdoptionSystem'
import Reports from './parent/Reports'
import ChildProfile from './parent/ChildProfile'

const items = [
  { label: 'Overview', path: '/dashboard/parent' },
  { label: 'Profile & Children', path: '/dashboard/parent/profile' },
  { label: 'Hire Nanny', path: '/dashboard/parent/hire-nanny' },
  { label: 'Daycare', path: '/dashboard/parent/daycare' },
  { label: 'Safety Monitor', path: '/dashboard/parent/safety' },
  { label: 'Learning', path: '/dashboard/parent/learning' },
  { label: 'Marketplace', path: '/dashboard/parent/marketplace' },
  { label: 'Adoption', path: '/dashboard/parent/adoption' },
  { label: 'Notifications', path: '/dashboard/parent/notifications' },
  { label: 'Messages', path: '/dashboard/parent/messages' },
  { label: 'Reports', path: '/dashboard/parent/reports' },
]

function ProfileView() {
  const { user } = useAuth() || {}
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    emergencyContact: '',
    childName: 'Emma',
    childAge: '4',
    childNotes: 'No allergies reported',
  })

  const updateField = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Parent Profile</h1>
        <p className="mt-2 text-slate-600">Manage parent details, child information, and emergency contacts.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <form
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault()
            alert('Profile updated successfully.')
          }}
        >
          <div className="mb-6 flex items-center gap-5">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-fuchsia-500 bg-slate-100">
              <span className="flex h-full w-full items-center justify-center text-3xl">👤</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Profile Photo</h2>
              <input type="file" className="mt-2 text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-fuchsia-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-fuchsia-700 hover:file:bg-fuchsia-100" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Account Details</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ['name', 'Full Name'],
              ['email', 'Email'],
              ['phone', 'Phone Number'],
              ['address', 'Address'],
              ['emergencyContact', 'Emergency Contact'],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500"
                  value={profile[key]}
                  onChange={event => updateField(key, event.target.value)}
                  type={key === 'email' ? 'email' : 'text'}
                />
              </label>
            ))}
          </div>
          <button className="mt-5 rounded-lg bg-fuchsia-600 px-5 py-2 font-semibold text-white hover:bg-fuchsia-700">
            Save Profile
          </button>
        </form>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Child Information</h2>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">Child Name</span>
            <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" value={profile.childName} onChange={event => updateField('childName', event.target.value)} />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">Age</span>
            <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" value={profile.childAge} onChange={event => updateField('childAge', event.target.value)} />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">Care Notes</span>
            <textarea className="mt-2 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2" value={profile.childNotes} onChange={event => updateField('childNotes', event.target.value)} />
          </label>
        </section>
      </div>
    </div>
  )
}

function NotificationsView() {
  const notifications = [
    { title: 'Safety alert', body: 'Emma arrived at daycare and is inside the safe zone.', time: '5 mins ago', tone: 'border-red-400 bg-red-50' },
    { title: 'Order update', body: 'Baby formula order is out for delivery.', time: '40 mins ago', tone: 'border-blue-400 bg-blue-50' },
    { title: 'Meetup reminder', body: 'Adoption meetup scheduled for May 25, 2026 at 10:00 AM.', time: 'Today', tone: 'border-purple-400 bg-purple-50' },
    { title: 'Activity report', body: 'Lunch and nap reports are ready to review.', time: 'Today', tone: 'border-green-400 bg-green-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
        <p className="mt-2 text-slate-600">Safety alerts, order updates, meetup reminders, and child activity reports.</p>
      </div>
      <div className="space-y-3">
        {notifications.map(item => (
          <div key={item.title} className={`rounded-lg border-l-4 p-4 ${item.tone}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-bold text-slate-900">{item.title}</h2>
                <p className="mt-1 text-sm text-slate-700">{item.body}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-slate-500">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MessagesView() {
  const threads = [
    { name: 'Nanny Maria', message: 'Meal update: Emma finished lunch and is ready for nap time.', status: 'Online' },
    { name: 'Sunshine Daycare Admin', message: 'Tomorrow pickup window has been confirmed.', status: 'Active' },
    { name: 'Orphanage Manager', message: 'Your meetup confirmation has been received.', status: 'Pending reply' },
    { name: 'Support Team', message: 'Payment receipt is available in reports.', status: 'Open' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="mt-2 text-slate-600">Communicate with nannies, daycare admins, orphanage managers, and support.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-2">
          {threads.map(thread => (
            <button key={thread.name} className="w-full rounded-lg border border-slate-200 bg-white p-4 text-left hover:border-fuchsia-400">
              <p className="font-bold text-slate-900">{thread.name}</p>
              <p className="mt-1 truncate text-sm text-slate-600">{thread.message}</p>
              <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{thread.status}</span>
            </button>
          ))}
        </aside>
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Conversation</h2>
          <div className="mt-4 space-y-3">
            <p className="max-w-lg rounded-lg bg-slate-100 p-3 text-sm text-slate-700">Meal update: Emma finished lunch and is ready for nap time.</p>
            <p className="ml-auto max-w-lg rounded-lg bg-fuchsia-600 p-3 text-sm text-white">Thank you. Please send the sleep report when she wakes up.</p>
          </div>
          <div className="mt-6 flex gap-2">
            <input className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="Write a message..." />
            <button className="rounded-lg bg-fuchsia-600 px-5 py-2 font-semibold text-white hover:bg-fuchsia-700">Send</button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function ParentDashboard() {
  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#0B0E14] text-white md:flex">
      <Sidebar items={items} variant="parent-workspace" />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="hire-nanny" element={<HireNanny />} />
          <Route path="daycare" element={<DaycareManagement />} />
          <Route path="safety" element={<SafetyMonitoring />} />
          <Route path="gps" element={<SafetyMonitoring />} />
          <Route path="sos" element={<SafetyMonitoring />} />
          <Route path="learning" element={<LearningPlatform />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="adoption" element={<AdoptionSystem />} />
          <Route path="notifications" element={<NotificationsView />} />
          <Route path="messages" element={<MessagesView />} />
          <Route path="reports" element={<Reports />} />
          <Route path="child-profile/:id" element={<ChildProfile />} />
        </Routes>
      </main>
    </div>
  )
}
