import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, AlertTriangle, ShieldCheck, CheckCircle, XCircle,
  Calendar, Activity, Video, LifeBuoy, Building2, UserPlus,
  ChevronLeft, ChevronRight, Check, X, ShieldAlert, Sparkles, LogOut
} from 'lucide-react'
import api from '../../services/api'
import Skeleton, { SkeletonOverviewCards } from '../../components/Skeleton'
import SEO from '../../components/SEO'

export default function AdminDashboard() {
  const { user, logout } = useAuth() || {}
  const isDaycare = user?.role === 'daycare'
  const isSystemAdmin = user?.role === 'admin' || !isDaycare

  const [activePage, setActivePage] = useState('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [pendingVerifications, setPendingVerifications] = useState([])
  const [activeSOS, setActiveSOS] = useState([])
  const [orphanages, setOrphanages] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    activeSessions: 186,
    totalOrphanages: 15,
    pendingVerifications: 0,
    activeAlerts: 0
  })

  useEffect(() => {
    if (isSystemAdmin) {
      Promise.all([
        api.get('/admin/verifications').then(res => {
          if (res.data?.ok) setPendingVerifications(res.data.data)
        }).catch(console.error),

        api.get('/sos/all').then(res => {
          if (res.data?.ok) setActiveSOS(res.data.data)
        }).catch(console.error),

        api.get('/orphanages').then(res => {
          if (res.data?.ok) setOrphanages(res.data.data)
        }).catch(console.error),

        api.get('/dashboard/admin/stats').then(res => {
          if (res.data?.ok) setStats(res.data.data)
        }).catch(console.error)
      ]).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [isSystemAdmin, refresh])

  const handleVerify = async (id, status) => {
    try {
      await api.patch(`/admin/verifications/${id}`, { status })
      setRefresh(r => r + 1)
    } catch (err) {
      console.error(err)
    }
  }

  const handleVerifyOrphanage = async (id, status) => {
    try {
      await api.patch(`/orphanages/${id}/status`, { status })
      setRefresh(r => r + 1)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSOSResolve = async (id) => {
    try {
      await api.patch(`/sos/${id}`, { status: 'Resolved' })
      setRefresh(r => r + 1)
    } catch (err) {
      console.error(err)
    }
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'verifications', label: 'Verifications', icon: CheckCircle, badge: pendingVerifications.length },
    { id: 'sos', label: 'SOS Emergencies', icon: AlertTriangle, badge: activeSOS.length, critical: true },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'admissions', label: 'Admissions', icon: UserPlus },
    { id: 'children', label: 'Children Registry', icon: Users },
    { id: 'safety', label: 'Safety & CCTV', icon: Video },
    { id: 'support', label: 'Support & Disputes', icon: LifeBuoy }
  ]

  // Render components for each tab
  function renderContent() {
    if (loading) {
      return (
        <div className="space-y-6">
          <SkeletonOverviewCards />
          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      )
    }

    switch (activePage) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Pending Nannies', value: pendingVerifications.length, desc: 'Needs verification', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Active Work Sessions', value: stats.activeSessions, desc: 'Live tracking active', color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'SOS Alerts', value: activeSOS.length, desc: activeSOS.length > 0 ? 'CRITICAL - Action req.' : 'All clear', color: activeSOS.length > 0 ? 'text-red-600 animate-pulse' : 'text-slate-500', bg: activeSOS.length > 0 ? 'bg-red-50' : 'bg-slate-50' },
                { label: 'Registered Orgs', value: orphanages.length || stats.totalOrphanages, desc: 'Partner institutions', color: 'text-purple-600', bg: 'bg-purple-50' }
              ].map((card, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                  <p className={`mt-2 text-4xl font-extrabold ${card.color}`}>{card.value}</p>
                  <p className="mt-1 text-xs text-slate-500 font-semibold">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Platform Health and Metrics */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-500" /> Platform Telemetry & Health
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Active Escrow Salary Payments', value: '$4,520 processing', status: 'Nominal', bg: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Smart Matches Completed Today', value: '142 successful matches', status: 'Optimal', bg: 'bg-sky-50 text-sky-700' },
                    { label: 'Safe Zone Deviations (Last 24h)', value: '8 alerts triggered', status: 'Attention', bg: 'bg-amber-50 text-amber-700' },
                    { label: 'Payment Disputes Pending', value: '3 cases open', status: 'Urgent', bg: 'bg-rose-50 text-rose-700' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 bg-slate-50/50">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.value}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${item.bg}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" /> System Auto-pilot & AI
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    AI verification algorithms are scanning incoming nanny documentation and flag inconsistencies in real time. Safety telemetry checks for geo-fencing logs every 15 seconds.
                  </p>
                  <div className="mt-4 p-4 rounded-xl bg-purple-50/30 border border-purple-100/50">
                    <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">AI Trust Scanning</p>
                    <p className="text-xs text-slate-600 mt-1">98.2% automated document verification match success rate today.</p>
                  </div>
                </div>
                <button onClick={() => alert('Opening AI & Telemetry controls...')} className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm">
                  Configure Systems
                </button>
              </div>
            </div>
          </div>
        )

      case 'verifications':
        return (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Verification Center</h3>
                <p className="text-xs text-slate-500">Approve or reject pending registrations for nannies and organizations.</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{pendingVerifications.length} Pending</span>
            </div>

            <div className="grid gap-4">
              {pendingVerifications.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">All caught up!</p>
                  <p className="text-xs text-slate-500 mt-1">No pending verifications at the moment.</p>
                </div>
              ) : (
                pendingVerifications.map((v: any) => (
                  <div key={v.id} className="p-5 border border-slate-100 bg-slate-50/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${v.type === 'Organization' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{v.type}</span>
                        <h4 className="font-bold text-slate-900">{v.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Submitted documents: <span className="font-mono text-slate-700">{v.docs.join(', ')}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleVerify(v.id, 'Approved')} className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition" title="Approve">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleVerify(v.id, 'Rejected')} className="p-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl transition" title="Reject">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      case 'sos':
        return (
          <div className="rounded-2xl border border-red-100 bg-red-50/30 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <AlertTriangle className="h-36 w-36 text-red-900" />
            </div>
            <div className="flex items-center gap-3 mb-6">
              {activeSOS.length > 0 && (
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-red-950">Live SOS Incident Center</h3>
                <p className="text-xs text-red-700/80">Immediate responder console for emergency situations.</p>
              </div>
            </div>

            <div className="grid gap-4 relative z-10">
              {activeSOS.length === 0 ? (
                <div className="p-8 bg-white border border-red-100 rounded-2xl text-center">
                  <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">Ecosystem Status Normal</p>
                  <p className="text-xs text-slate-500 mt-1">No active SOS alerts received.</p>
                </div>
              ) : (
                activeSOS.map((sos: any) => (
                  <div key={sos.id} className="bg-white border border-red-100/50 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase tracking-wider">{sos.category} • {sos.time}</span>
                      <h4 className="text-base font-bold text-slate-900 mt-2">Nanny: {sos.nanny}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-1">Location coordinates: {sos.location}</p>
                      <p className="text-xs text-slate-700 mt-2 font-semibold">Message: "{sos.message}"</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => alert(`Dialing nanny at details provided...`)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition">Contact</button>
                      <button onClick={() => handleSOSResolve(sos.id)} className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition">Resolve</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      case 'organizations':
        return (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Ecosystem Organizations</h3>
                <p className="text-xs text-slate-500">Registered daycares, schools, care groups, and orphanages.</p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">{orphanages.length} Registered</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {orphanages.length > 0 ? (
                orphanages.map((org: any, idx) => (
                  <div key={idx} className="border border-slate-100 p-5 rounded-2xl hover:shadow-md transition bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-fuchsia-100 text-fuchsia-700">Orphanage</span>
                      <h4 className="font-bold text-slate-900 mt-2 truncate">{org.orphanage_name}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-mono">License: {org.license_number || 'N/A'}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${org.verification_status === 'verified' ? 'text-emerald-600' : 'text-amber-500 animate-pulse'}`}>{org.verification_status}</span>
                      {org.verification_status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleVerifyOrphanage(org.id, 'verified')} className="text-xs text-emerald-600 font-bold hover:underline">Approve</button>
                          <button onClick={() => handleVerifyOrphanage(org.id, 'rejected')} className="text-xs text-red-600 font-bold hover:underline">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-6 text-slate-400 text-sm">No orphanages found.</div>
              )}
            </div>
          </div>
        )

      case 'admissions':
        return (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Admissions & Applications</h3>
            <p className="text-xs text-slate-500 mb-6">Cross-institutional registration requests and enrollment logs.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold">
                    <th className="pb-3 font-semibold">Child Name</th>
                    <th className="pb-3 font-semibold">Destination Facility</th>
                    <th className="pb-3 font-semibold">Parent / Submitter</th>
                    <th className="pb-3 font-semibold">Date Submitted</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { child: 'Emma Stone', target: 'Little Stars Daycare', parent: 'John Stone', date: 'June 01, 2026', status: 'Approved' },
                    { child: 'Liam Neeson', target: 'Rainbow Learning Center', parent: 'Sarah Neeson', date: 'May 28, 2026', status: 'Pending Review' },
                    { child: 'Noah Miller', target: 'Happy Hearts Childcare', parent: 'Lisa Miller', date: 'May 27, 2026', status: 'Approved' }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                      <td className="py-4 font-bold text-slate-900">{row.child}</td>
                      <td className="py-4 text-slate-700">{row.target}</td>
                      <td className="py-4 text-slate-600">{row.parent}</td>
                      <td className="py-4 text-slate-500">{row.date}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${row.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'children':
        return (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Active Children Registry</h3>
            <p className="text-xs text-slate-500 mb-6">Ecosystem-wide list of children with active care status.</p>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: 'Emma Stone', age: '4 yrs', care: 'Daycare Mode', details: 'Assigned: Lisa Thompson (Teacher)' },
                { name: 'Liam Miller', age: '3 yrs', care: 'Nanny Assigned', details: 'Assigned: Kamrun Nahar (Nanny)' }
              ].map((child, idx) => (
                <div key={idx} className="border border-slate-100 rounded-2xl p-5 flex items-center gap-4 bg-slate-50/50">
                  <div className="text-2xl w-12 h-12 bg-white rounded-full flex items-center justify-center border shadow-sm shrink-0">👧</div>
                  <div>
                    <h4 className="font-bold text-slate-900">{child.name} <span className="text-xs text-slate-400 font-normal">({child.age})</span></h4>
                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">{child.care}</p>
                    <p className="text-xs text-slate-500 mt-1">{child.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'safety':
        return (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Safety & CCTV Center</h3>
                <p className="text-xs text-slate-500">Live feeds, safe zone status, and telemetry deviations.</p>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-slate-950 aspect-video flex flex-col justify-between p-4 text-white relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.8)_100%)]"></div>
                <div className="flex justify-between items-center relative z-10">
                  <span className="bg-red-600 text-[10px] px-2 py-0.5 font-bold rounded animate-pulse uppercase tracking-wider">REC CH-01</span>
                  <span className="text-[10px] font-mono text-slate-300">Playground East</span>
                </div>
                <div className="text-center py-6 text-slate-400 text-sm relative z-10">
                  <p className="text-5xl mb-2">🧒🏕️</p>
                  <p className="font-mono text-xs">FEED ONLINE • 30 FPS</p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 relative z-10">
                  <span>1080p HD</span>
                  <span>{new Date().toISOString().split('T')[0]}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-sm">Active Safe Zones</h4>
                {[
                  { zone: 'Little Stars Playground', radius: '500m', alerts: '0 deviations', status: 'Nominal' },
                  { zone: 'Gulshan Nanny Route', radius: '1.2km', alerts: '1 deviation resolved', status: 'Nominal' }
                ].map((sz, idx) => (
                  <div key={idx} className="border border-slate-100 p-4 bg-slate-50/50 rounded-xl flex items-center justify-between text-xs font-semibold">
                    <div>
                      <h5 className="font-bold text-slate-950">{sz.zone}</h5>
                      <p className="text-slate-500 mt-1">Radius: {sz.radius} • {sz.alerts}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold uppercase tracking-wider">{sz.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'support':
        return (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dispute & Support Resolution</h3>
            <p className="text-xs text-slate-500 mb-6">Resolve platform complaints and payment disputes.</p>

            <div className="space-y-3">
              {[
                { user: 'Sarah Miller (Parent)', title: 'Nanny session hours discrepancy', id: 'TKT-9912', priority: 'High', status: 'Under Review' },
                { user: 'Maria Mim (Nanny)', title: 'Escrow release processing delay', id: 'TKT-9854', priority: 'Medium', status: 'Resolved' }
              ].map((ticket, idx) => (
                <div key={idx} className="p-5 border border-slate-100 rounded-2xl hover:border-slate-200 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {ticket.id}</span>
                    <h4 className="font-bold text-slate-900 mt-1">{ticket.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Created by: {ticket.user}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ticket.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{ticket.priority}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'}`}>{ticket.status}</span>
                    <button onClick={() => alert(`Opening details for ${ticket.id}`)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition">Resolve</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEO title="System Admin - Smart Nanny" description="Manage verifications, SOS alerts, organizations, and platform settings." />
      {/* Collapsible Sidebar */}
      <aside
        className="flex flex-col h-full transition-all duration-300 bg-slate-900 border-r border-slate-800 min-w-0"
        style={{ width: sidebarCollapsed ? 64 : 240 }}
      >
        {/* Sidebar Logo / Header */}
        <div className="flex items-center h-16 px-4 gap-3 border-b border-slate-800">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 flex-shrink-0 shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={18} color="#fff" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-extrabold text-white truncate">SmartNanny</h1>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate">System Admin</p>
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
            const active = activePage === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all relative group text-left ${
                  active
                    ? 'bg-slate-800 text-white border-l-4 border-indigo-500'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <Icon size={18} className={active ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'} />
                {!sidebarCollapsed && (
                  <>
                    <span className="text-xs font-bold truncate flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${item.critical ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && item.badge > 0 && (
                  <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${item.critical ? 'bg-red-500 animate-ping' : 'bg-indigo-500'}`} />
                )}

                {/* Collapsed tooltip */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-slate-950 text-white text-[10px] rounded font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
                    {item.label}
                  </div>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0">
              AD
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">Administrator</p>
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
            <span className="text-xs font-bold text-slate-400">System Admin Control Center</span>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs font-extrabold text-slate-800 text-capitalize">
              {activePage.replace(/-/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              {new Date().toLocaleDateString('en-BD', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700">Online</span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 min-h-0 overflow-y-auto p-6" style={{ scrollbarWidth: 'none' }}>
          {isSystemAdmin ? (
            renderContent()
          ) : (
            <div className="p-8 border border-red-200 bg-red-50 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-bold text-red-800">Access Denied</h4>
                <p className="text-xs text-red-700 mt-0.5">You do not have administrative privileges to access this system control center.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
