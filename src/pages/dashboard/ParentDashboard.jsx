import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import Overview from './parent/Overview'
import HireNanny from './parent/HireNanny'
import DaycareLayout from './parent/DaycareLayout'
import SafetyMonitoring from './parent/SafetyMonitoring'
import LearningPlatform from './parent/LearningPlatform'
import Marketplace from './parent/Marketplace'
import AdoptionLayout from './parent/AdoptionLayout'
import Reports from './parent/Reports'
import ChildProfile from './parent/ChildProfile'

const items = [
  { label: 'Dashboard', path: '/dashboard/parent', icon: 'svg-dashboard' },
  { label: 'Nanny', path: '/dashboard/parent/hire-nanny', icon: 'svg-nanny' },
  { label: 'Daycare', path: '/dashboard/parent/daycare', icon: 'svg-daycare' },
  { label: 'Adoption', path: '/dashboard/parent/adoption', icon: 'svg-adoption' },
  { label: 'Shop', path: '/dashboard/parent/marketplace', icon: 'svg-shop' },
  { label: 'Job Requests', path: '/dashboard/parent/job-requests', icon: 'svg-job-requests' },
  { label: 'Interviews', path: '/dashboard/parent/interviews', icon: 'svg-interviews' },
  { label: 'Schedule', path: '/dashboard/parent/schedule', icon: 'svg-schedule' },
  { label: 'Messages', path: '/dashboard/parent/messages', icon: 'svg-messages' },
  { label: 'Notifications', path: '/dashboard/parent/notifications', icon: 'svg-notifications' },
  { label: 'Settings', path: '/dashboard/parent/settings', icon: 'svg-settings' },
]

function ProfileView() {
  const { user } = useAuth() || {}
  const [isEditingPin, setIsEditingPin] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    emergencyContact: '',
    childModePin: '',
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
        <h1 className="text-3xl font-bold text-white">Parent Profile</h1>
        <p className="mt-2 text-slate-300">Manage parent details, child information, and emergency contacts.</p>
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
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500 text-slate-900"
                  value={profile[key]}
                  onChange={event => updateField(key, event.target.value)}
                  type={key === 'email' ? 'email' : 'text'}
                />
              </label>
            ))}
          </div>

          <h2 className="mt-6 text-lg font-bold text-slate-900">Security</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Child Mode PIN</span>
              <div className="flex gap-2 mt-2">
                <input
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500 text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
                  value={profile.childModePin}
                  onChange={event => updateField('childModePin', event.target.value)}
                  type="password"
                  maxLength={4}
                  placeholder="e.g. 1234"
                  disabled={!isEditingPin}
                />
                <button
                  type="button"
                  onClick={() => setIsEditingPin(!isEditingPin)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition font-semibold"
                >
                  {isEditingPin ? 'Done' : 'Edit'}
                </button>
              </div>
              <span className="text-xs text-slate-500 block mt-1">4-digit PIN required to exit Child Mode</span>
            </label>
          </div>

          <button className="mt-6 rounded-lg bg-fuchsia-600 px-5 py-2 font-semibold text-white hover:bg-fuchsia-700">
            Save Profile
          </button>
        </form>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Child Information</h2>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">Child Name</span>
            <input className="mt-2 w-full rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" value={profile.childName} onChange={event => updateField('childName', event.target.value)} />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">Age</span>
            <input className="mt-2 w-full rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" value={profile.childAge} onChange={event => updateField('childAge', event.target.value)} />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">Care Notes</span>
            <textarea className="mt-2 min-h-24 w-full rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" value={profile.childNotes} onChange={event => updateField('childNotes', event.target.value)} />
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
        <h1 className="text-3xl font-bold text-white">Notifications</h1>
        <p className="mt-2 text-slate-300">Safety alerts, order updates, meetup reminders, and child activity reports.</p>
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
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="mt-2 text-slate-300">Communicate with nannies, daycare admins, orphanage managers, and support.</p>
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

function JobRequestsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Job Requests</h1>
      <p className="mt-2 text-slate-600">View and manage your job requests.</p>
    </div>
  )
}

function InterviewsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Interviews</h1>
      <p className="mt-2 text-slate-600">Schedule and manage your interviews.</p>
    </div>
  )
}

function ScheduleView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Schedule</h1>
      <p className="mt-2 text-slate-600">View your schedule and appointments.</p>
    </div>
  )
}

function SettingsView() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    locationSharing: true,
    twoFactor: false,
    darkTheme: true
  })

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-[#151821] border border-[#2A2E3D] rounded-xl hover:border-fuchsia-500/50 transition">
      <div>
        <h3 className="text-white font-semibold">{label}</h3>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-fuchsia-600' : 'bg-slate-700'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-slate-400">Manage your account preferences, notifications, and privacy.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notifications Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔔</span>
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>
          <Toggle
            label="Email Alerts"
            description="Receive daily summaries and important updates via email."
            checked={settings.emailAlerts}
            onChange={() => toggleSetting('emailAlerts')}
          />
          <Toggle
            label="SMS Alerts"
            description="Get text messages for urgent safety alerts."
            checked={settings.smsAlerts}
            onChange={() => toggleSetting('smsAlerts')}
          />
          <Toggle
            label="Push Notifications"
            description="Receive app notifications for live updates."
            checked={settings.pushNotifications}
            onChange={() => toggleSetting('pushNotifications')}
          />
        </section>

        {/* Security & Privacy Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔒</span>
            <h2 className="text-xl font-bold text-white">Security & Privacy</h2>
          </div>
          <Toggle
            label="Live Location Sharing"
            description="Allow daycare and transport to see your child's location."
            checked={settings.locationSharing}
            onChange={() => toggleSetting('locationSharing')}
          />
          <Toggle
            label="Two-Factor Authentication"
            description="Require an extra code when logging in."
            checked={settings.twoFactor}
            onChange={() => toggleSetting('twoFactor')}
          />
        </section>
      </div>

      <div className="pt-6 border-t border-[#2A2E3D]">
        <h2 className="text-xl font-bold text-white mb-4">Account Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-5 py-2.5 bg-[#151821] border border-[#2A2E3D] text-white rounded-xl hover:bg-slate-800 transition font-semibold">
            Change Password
          </button>
          <button className="px-5 py-2.5 bg-[#151821] border border-[#2A2E3D] text-white rounded-xl hover:bg-slate-800 transition font-semibold">
            Manage Payment Methods
          </button>
          <button className="px-5 py-2.5 bg-red-950/30 border border-red-900/50 text-red-400 rounded-xl hover:bg-red-900/40 transition font-semibold ml-auto">
            Deactivate Account
          </button>
        </div>
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
          <Route path="hire-nanny/*" element={<HireNanny />} />
          <Route path="daycare/*" element={<DaycareLayout />} />
          <Route path="safety" element={<SafetyMonitoring />} />
          <Route path="gps" element={<SafetyMonitoring />} />
          <Route path="sos" element={<SafetyMonitoring />} />
          <Route path="learning" element={<LearningPlatform />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="adoption/*" element={<AdoptionLayout />} />
          <Route path="notifications" element={<NotificationsView />} />
          <Route path="messages" element={<MessagesView />} />
          <Route path="reports" element={<Reports />} />
          <Route path="child-profile/:id" element={<ChildProfile />} />
          <Route path="job-requests" element={<JobRequestsView />} />
          <Route path="interviews" element={<InterviewsView />} />
          <Route path="schedule" element={<ScheduleView />} />
          <Route path="settings" element={<SettingsView />} />
        </Routes>
      </main>
    </div>
  )
}
