import React, { useState, useEffect } from 'react'
import { Route, Routes, NavLink, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import SEO from '../../components/SEO'
import Overview from './parent/Overview'
import HireNanny from './parent/HireNanny'
import DaycareLayout from './parent/DaycareLayout'
import SafetyMonitoring from './parent/SafetyMonitoring'
import LearningPlatform from './parent/LearningPlatform'
import Marketplace from './parent/Marketplace'
import AdoptionLayout from './parent/AdoptionLayout'
import Reports from './parent/Reports'
import ChildProfile from './parent/ChildProfile'
import FamilySchedule from './parent/FamilySchedule'
import JobRequests from './parent/JobRequests'
import Interviews from './parent/Interviews'
import {
  Home, Briefcase, Heart, ShoppingBag, ClipboardList, Users,
  Calendar, MessageSquare, Bell, Settings, ChevronLeft, ChevronRight,
  LogOut, ShieldCheck, ShieldAlert, Sparkles, Baby
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/dashboard/parent', icon: Home },
  { label: 'Nanny', path: '/dashboard/parent/hire-nanny', icon: Briefcase },
  { label: 'Daycare', path: '/dashboard/parent/daycare', icon: Baby },
  { label: 'Adoption', path: '/dashboard/parent/adoption', icon: Heart },
  { label: 'Shop', path: '/dashboard/parent/marketplace', icon: ShoppingBag },
  { label: 'Job Requests', path: '/dashboard/parent/job-requests', icon: ClipboardList },
  { label: 'Interviews', path: '/dashboard/parent/interviews', icon: Users },
  { label: 'Schedule', path: '/dashboard/parent/schedule', icon: Calendar },
  { label: 'Messages', path: '/dashboard/parent/messages', icon: MessageSquare },
  { label: 'Notifications', path: '/dashboard/parent/notifications', icon: Bell },
  { label: 'Settings', path: '/dashboard/parent/settings', icon: Settings },
]

function ProfileView() {
  const { user } = useAuth() || {}
  const [isEditingPin, setIsEditingPin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    emergencyContact: '',
    childModePin: '',
    childName: '',
    childAge: '',
    childNotes: '',
  })

  useEffect(() => {
    api.get('/families/my/profile').then(res => {
      if (res.data.ok) {
        setProfile(prev => ({ ...prev, ...res.data.profile }))
      }
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [])

  const updateField = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    try {
      const res = await api.put('/families/my/profile', profile)
      if (res.data.ok) {
        alert('Profile updated successfully.')
      } else {
        alert('Failed to update profile: ' + res.data.error)
      }
    } catch (err) {
      console.error(err)
      alert('Error updating profile.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Parent Profile</h1>
        <p className="mt-2 text-slate-500">Manage parent details, child information, and emergency contacts.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <form
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          onSubmit={handleSave}
        >
          <div className="mb-6 flex items-center gap-5">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Profile Photo</h2>
              <input type="file" className="mt-2 text-xs text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-fuchsia-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-fuchsia-700 hover:file:bg-fuchsia-100" />
            </div>
          </div>
          <h2 className="text-base font-bold text-slate-900">Account Details</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ['name', 'Full Name'],
              ['email', 'Email'],
              ['phone', 'Phone Number'],
              ['address', 'Address'],
              ['emergencyContact', 'Emergency Contact'],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-xs font-bold text-slate-700">{label}</span>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-fuchsia-500 text-xs text-slate-900"
                  value={profile[key]}
                  onChange={event => updateField(key, event.target.value)}
                  type={key === 'email' ? 'email' : 'text'}
                />
              </label>
            ))}
          </div>

          <h2 className="mt-6 text-base font-bold text-slate-900">Security</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold text-slate-700">Child Mode PIN</span>
              <div className="flex gap-2 mt-2">
                <input
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-fuchsia-500 text-xs text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
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
                  className="px-4 py-2.5 bg-slate-200 text-slate-800 rounded-xl hover:bg-slate-300 transition text-xs font-bold"
                >
                  {isEditingPin ? 'Done' : 'Edit'}
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1.5">4-digit PIN required to exit Child Mode</span>
            </label>
          </div>

          <button className="mt-6 rounded-xl bg-fuchsia-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-fuchsia-700 transition">
            Save Profile
          </button>
        </form>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Child Information</h2>
          <label className="mt-4 block">
            <span className="text-xs font-bold text-slate-700">Child Name</span>
            <input className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-fuchsia-500" value={profile.childName} onChange={event => updateField('childName', event.target.value)} />
          </label>
          <label className="mt-4 block">
            <span className="text-xs font-bold text-slate-700">Age</span>
            <input className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-fuchsia-500" value={profile.childAge} onChange={event => updateField('childAge', event.target.value)} />
          </label>
          <label className="mt-4 block">
            <span className="text-xs font-bold text-slate-700">Care Notes</span>
            <textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-fuchsia-500" value={profile.childNotes} onChange={event => updateField('childNotes', event.target.value)} />
          </label>
        </section>
      </div>
    </div>
  )
}

function NotificationsView() {
  const notifications = [
    { title: 'Safety alert', body: 'Emma arrived at daycare and is inside the safe zone.', time: '5 mins ago', tone: 'border-red-400 bg-red-50 text-red-900' },
    { title: 'Order update', body: 'Baby formula order is out for delivery.', time: '40 mins ago', tone: 'border-blue-400 bg-blue-50 text-blue-900' },
    { title: 'Meetup reminder', body: 'Adoption meetup scheduled for May 25, 2026 at 10:00 AM.', time: 'Today', tone: 'border-purple-400 bg-purple-50 text-purple-900' },
    { title: 'Activity report', body: 'Lunch and nap reports are ready to review.', time: 'Today', tone: 'border-green-400 bg-green-50 text-green-900' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Notifications</h1>
        <p className="mt-2 text-slate-500">Safety alerts, order updates, meetup reminders, and child activity reports.</p>
      </div>
      <div className="space-y-3">
        {notifications.map(item => (
          <div key={item.title} className={`rounded-2xl border-l-4 p-4 shadow-sm ${item.tone}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-bold text-sm">{item.title}</h2>
                <p className="mt-1 text-xs">{item.body}</p>
              </div>
              <span className="shrink-0 text-[10px] font-bold opacity-75">{item.time}</span>
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
        <h1 className="text-3xl font-bold text-slate-950">Messages</h1>
        <p className="mt-2 text-slate-500">Communicate with nannies, daycare admins, orphanage managers, and support.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-2">
          {threads.map(thread => (
            <button key={thread.name} className="w-full rounded-2xl border border-slate-100 bg-white p-4 text-left hover:border-fuchsia-400 transition shadow-sm">
              <p className="font-bold text-slate-900 text-sm">{thread.name}</p>
              <p className="mt-1 truncate text-xs text-slate-600">{thread.message}</p>
              <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{thread.status}</span>
            </button>
          ))}
        </aside>
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Conversation</h2>
          <div className="mt-4 space-y-3">
            <p className="max-w-lg rounded-2xl bg-slate-100 p-3.5 text-xs text-slate-700">Meal update: Emma finished lunch and is ready for nap time.</p>
            <p className="ml-auto max-w-lg rounded-2xl bg-fuchsia-600 p-3.5 text-xs text-white">Thank you. Please send the sleep report when she wakes up.</p>
          </div>
          <div className="mt-6 flex gap-2">
            <input className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="Write a message..." />
            <button className="rounded-xl bg-fuchsia-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-fuchsia-700 transition">Send</button>
          </div>
        </section>
      </div>
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
    darkTheme: false
  })

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-fuchsia-500/50 transition shadow-sm">
      <div>
        <h3 className="text-slate-950 font-bold text-xs">{label}</h3>
        <p className="text-[10px] text-slate-500 mt-1">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-fuchsia-600' : 'bg-slate-300'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Settings</h1>
        <p className="mt-2 text-slate-500">Manage your account preferences, notifications, and privacy.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notifications Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔔</span>
            <h2 className="text-base font-bold text-slate-900">Notifications</h2>
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
            <h2 className="text-base font-bold text-slate-900">Security & Privacy</h2>
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

      <div className="pt-6 border-t border-slate-200">
        <h2 className="text-base font-bold text-slate-900 mb-4">Account Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-5 py-2.5 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition font-bold text-xs">
            Change Password
          </button>
          <button className="px-5 py-2.5 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition font-bold text-xs">
            Manage Payment Methods
          </button>
          <button className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-bold text-xs ml-auto">
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ParentDashboard() {
  const { user, logout } = useAuth() || {}
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <SEO title="Parent Portal - Smart Nanny" description="Manage your children's care, find nannies, and track daily activities." />
      
      {/* Collapsible Sidebar */}
      <aside 
        className="flex flex-col h-full transition-all duration-300 bg-slate-900 border-r border-slate-800 shrink-0 min-w-0"
        style={{ width: sidebarCollapsed ? 64 : 260 }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center h-16 px-4 gap-3 border-b border-slate-800">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-fuchsia-600 flex-shrink-0 shadow-lg shadow-fuchsia-500/20">
            <Baby size={18} color="#fff" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-extrabold text-white truncate">SmartNanny</h1>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate">Parent Portal</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ml-auto"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1" style={{ scrollbarWidth: 'none' }}>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard/parent'}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-2.5 transition-all relative group text-left ${
                    isActive
                      ? 'bg-slate-800 text-white border-l-4 border-fuchsia-500'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
                  }`
                }
              >
                <Icon size={18} className="text-slate-400 group-hover:text-white" />
                {!sidebarCollapsed && (
                  <span className="text-xs font-bold truncate">{item.label}</span>
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-slate-950 text-white text-[10px] rounded font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
                    {item.label}
                  </div>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <button 
            onClick={() => navigate('/dashboard/child')}
            className={`w-full flex items-center justify-center gap-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold transition text-xs shadow-md shadow-fuchsia-600/10 ${sidebarCollapsed ? 'p-2' : 'py-3'}`}
            title="Child Mode"
          >
            <Baby size={16} />
            {!sidebarCollapsed && <span>Child Mode</span>}
          </button>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'PT'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Parent'}</p>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors mt-0.5"
                >
                  <LogOut size={10} /> Log out
                </button>
              </div>
            )}
            {sidebarCollapsed && (
              <button
                onClick={logout}
                className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-slate-800 transition-colors ml-auto"
                title="Log out"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>

      </aside>

      {/* Main View Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between px-6 h-16 flex-shrink-0 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Parent Portal</span>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs font-extrabold text-slate-800">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              {new Date().toLocaleDateString('en-BD', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-fuchsia-50 border border-fuchsia-100">
              <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse" />
              <span className="text-[10px] font-bold text-fuchsia-700">Online</span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 min-h-0 overflow-y-auto p-6 text-slate-900 bg-slate-50" style={{ scrollbarWidth: 'none' }}>
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
            <Route path="job-requests" element={<JobRequests />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="schedule" element={<FamilySchedule />} />
            <Route path="settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>

    </div>
  )
}
