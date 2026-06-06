import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { 
  Home, ShieldCheck, AlertTriangle, Building, 
  ClipboardList, Users, Video, LifeBuoy,
  CheckCircle, XCircle 
} from 'lucide-react'
import api from '../../services/api'

const navGroups = [
  {
    title: 'Platform Control',
    items: [
      { label: 'Overview', path: '#overview', icon: Home },
      { label: 'Platform Health', path: '#health', icon: ShieldCheck },
    ]
  },
  {
    title: 'Emergencies & Security',
    items: [
      { label: 'SOS Emergencies', path: '#sos', icon: AlertTriangle, danger: true },
      { label: 'Safety & CCTV', path: '#safety', icon: Video },
    ]
  },
  {
    title: 'Management',
    items: [
      { label: 'Nanny Verification', path: '#verification', icon: CheckCircle },
      { label: 'Organizations', path: '#organizations', icon: Building },
      { label: 'Admissions', path: '#admissions', icon: ClipboardList },
      { label: 'Children Registry', path: '#children', icon: Users },
      { label: 'Disputes & Support', path: '#support', icon: LifeBuoy },
    ]
  }
];

export default function AdminDashboard(){
  const { user } = useAuth() || {}
  const isDaycare = user?.role === 'daycare'
  const isSystemAdmin = user?.role === 'admin' || !isDaycare

  const [pendingVerifications, setPendingVerifications] = useState([])
  const [activeSOS, setActiveSOS] = useState([])
  const [orphanages, setOrphanages] = useState([])
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    if (isSystemAdmin) {
      api.get('/admin/verifications').then(res => {
        if(res.data?.ok) setPendingVerifications(res.data.data)
      }).catch(console.error)
      
      api.get('/sos/all').then(res => {
        if(res.data?.ok) setActiveSOS(res.data.data)
      }).catch(console.error)
      
      api.get('/orphanages').then(res => {
        if(res.data?.ok) setOrphanages(res.data.data)
      }).catch(console.error)
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

  const metrics = [
    ['Pending Nannies', pendingVerifications.length, 'Needs verification'],
    ['Active Work Sessions', '186', 'Live tracking'],
    ['SOS Alerts', activeSOS.length, activeSOS.length > 0 ? 'CRITICAL - Action req.' : 'All clear'],
    ['Organizations', '15', '3 pending approval']
  ]

  const [activeHash, setActiveHash] = useState(window.location.hash || '#overview');

  useEffect(() => {
    const handleHash = () => setActiveHash(window.location.hash || '#overview');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <div className="h-[calc(100vh-70px)] bg-[#f8fafc] flex flex-col font-sans overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar matching Nanny UI */}
        <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto hidden md:flex shrink-0">
          <nav className="flex-1 py-6 px-4 space-y-8">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-4">{group.title}</h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activeHash === item.path || (activeHash === '' && item.path === '#overview');
                    return (
                      <a
                        key={item.path}
                        href={item.path}
                        onClick={() => setActiveHash(item.path)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-[#fdf4ff] text-[#a855f7] font-bold shadow-sm border border-[#f3e8ff]' 
                            : item.danger
                              ? 'text-red-600 hover:bg-red-50 hover:text-red-700 font-bold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-[#a855f7]' : item.danger ? 'text-red-500' : 'text-slate-400'}`} />
                        <span className="flex-1 text-[15px]">{item.label}</span>
                        {item.danger && activeSOS.length > 0 && (
                          <span className="bg-[#e11d48] text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
                            {activeSOS.length}
                          </span>
                        )}
                        {item.path === '#verification' && pendingVerifications.length > 0 && (
                          <span className="bg-blue-500 text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
                            {pendingVerifications.length}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 relative" id="overview">
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a855f7] mb-2">Smart Nanny Ecosystem Platform</p>
              <h2 className="text-3xl font-black text-slate-900">
                {isDaycare ? 'Daycare Admin Dashboard' : 'System Admin Control Center'}
              </h2>
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-500">
                Manage nanny and organization verifications, monitor live active work sessions, respond to SOS emergencies, and oversee the entire childcare ecosystem.
              </p>
            </div>
            {isSystemAdmin && (
              <ShieldCheck className="h-20 w-20 text-[#a855f7] opacity-10" />
            )}
          </section>

          {isSystemAdmin && (
            <>
              <section className="grid gap-5 md:grid-cols-4 mb-10">
                {metrics.map(([label, value, note], i) => (
                  <div key={label} className={`rounded-2xl border p-6 shadow-sm ${i === 2 && value > 0 ? 'border-red-200 bg-[#fff1f2]' : 'border-slate-200 bg-white'}`}>
                    <p className={`text-xs font-black uppercase tracking-wider mb-3 ${i === 2 && value > 0 ? 'text-red-500' : 'text-slate-400'}`}>{label}</p>
                    <p className={`text-4xl font-black ${i === 2 && value > 0 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>{value}</p>
                    <p className={`mt-2 text-sm font-semibold ${i === 2 && value > 0 ? 'text-red-500' : 'text-slate-500'}`}>{note}</p>
                  </div>
                ))}
              </section>

              <section className="mb-10 rounded-2xl border border-red-200 bg-[#fff1f2] p-8 shadow-sm relative overflow-hidden" id="sos">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <AlertTriangle className="h-48 w-48 text-red-900" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  {activeSOS.length > 0 && (
                    <div className="relative flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500"></span>
                    </div>
                  )}
                  <h3 className="text-2xl font-black text-red-950">Live SOS Emergency Center</h3>
                </div>
                
                <div className="grid gap-4">
                  {activeSOS.length === 0 ? (
                     <p className="text-[15px] font-bold text-slate-500 bg-white p-6 rounded-xl border border-red-100 text-center">No active SOS emergencies right now.</p>
                  ) : (
                    activeSOS.map(sos => (
                      <div key={sos.id} className="bg-white border border-red-100 p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                        <div>
                          <p className="text-xs font-black text-red-600 uppercase tracking-widest">{sos.category} • {sos.time}</p>
                          <h4 className="text-xl font-black text-slate-900 mt-2">Nanny: {sos.nanny}</h4>
                          <p className="text-[15px] text-slate-600 font-mono mt-1 bg-slate-50 px-3 py-1 rounded inline-block border border-slate-100">Location: {sos.location}</p>
                          <p className="text-[15px] text-slate-700 mt-3 font-semibold bg-red-50 px-4 py-2 rounded-lg border border-red-100">Message: {sos.message}</p>
                        </div>
                        <div className="flex gap-3">
                          <button className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-slate-900 transition">Contact Nanny</button>
                          <button onClick={() => handleSOSResolve(sos.id)} className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-red-700 transition">Resolve Issue</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="mb-10 grid gap-8 lg:grid-cols-2" id="health">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm" id="verification">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-slate-900">Pending Verifications</h3>
                    <span className="text-sm font-bold text-[#a855f7] hover:underline cursor-pointer">View All</span>
                  </div>
                  <div className="space-y-4">
                    {pendingVerifications.length === 0 ? (
                      <div className="p-5 border border-slate-100 bg-[#f8fafc] rounded-xl flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-100 text-blue-700">Nanny</span>
                            <h4 className="font-bold text-slate-900">Kamrun Nahar</h4>
                          </div>
                          <p className="text-[13px] font-medium text-slate-500 mt-2">Docs: National ID, Childcare Certification</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => alert('Approved Kamrun Nahar')} className="p-2.5 text-emerald-600 bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 rounded-xl transition shadow-sm" title="Approve">
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      pendingVerifications.map(v => (
                        <div key={v.id} className="p-5 border border-slate-100 bg-[#f8fafc] rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${v.type === 'Organization' ? 'bg-[#fdf4ff] text-[#a855f7]' : 'bg-blue-100 text-blue-700'}`}>{v.type}</span>
                              <h4 className="font-bold text-slate-900">{v.name}</h4>
                            </div>
                            <p className="text-[13px] font-medium text-slate-500 mt-2">Docs: {v.docs.join(', ')}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleVerify(v.id, 'Approved')} className="p-2.5 text-emerald-600 bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 rounded-xl transition shadow-sm" title="Approve">
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button onClick={() => handleVerify(v.id, 'Rejected')} className="p-2.5 text-red-500 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-xl transition shadow-sm" title="Reject">
                              <XCircle className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-6">Platform Health & Monitoring</h3>
                  <div className="space-y-4 text-[15px] text-slate-700 font-medium">
                    <div className="flex justify-between p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                      <span>Active Escrow Salary Payments</span>
                      <span className="font-bold">$4,520 processing</span>
                    </div>
                    <div className="flex justify-between p-4 bg-[#f8fafc] rounded-xl border border-slate-100">
                      <span>Smart Matches Completed Today</span>
                      <span className="font-bold text-[#a855f7]">142 matches</span>
                    </div>
                    <div className="flex justify-between p-4 bg-[#f8fafc] rounded-xl border border-slate-100">
                      <span>Safe Zone Deviations (Last 24h)</span>
                      <span className="font-bold text-amber-600">8 alerts</span>
                    </div>
                    <div className="flex justify-between p-4 bg-[#f8fafc] rounded-xl border border-slate-100">
                      <span>Payment Disputes Pending</span>
                      <span className="font-bold text-red-600">3 cases open</span>
                    </div>
                  </div>
                  <button onClick={() => alert('Detailed platform telemetry loading...')} className="mt-6 w-full py-3 text-center text-sm font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition shadow-sm">Open Full Analytics Dashboard</button>
                </div>
              </section>

              {/* 🏢 Organizations Section */}
              <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm scroll-mt-10" id="organizations">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Ecosystem Organizations</h3>
                    <p className="text-[15px] text-slate-500 mt-2">Verified partner daycares, schools, and care agencies</p>
                  </div>
                  <span className="px-4 py-1.5 bg-[#fdf4ff] text-[#a855f7] rounded-full text-xs font-black tracking-widest uppercase border border-[#f3e8ff]">12 Registered</span>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  {orphanages.length > 0 ? orphanages.map((org, idx) => (
                    <div key={idx} className="border border-slate-200 p-5 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition duration-200 bg-white">
                      <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md bg-[#f8fafc] text-slate-500 border border-slate-200">Orphanage</span>
                      <h4 className="font-black text-slate-900 text-lg mt-3">{org.orphanage_name}</h4>
                      <p className="text-[13px] font-medium text-slate-500 mt-1">License: <span className="font-mono bg-slate-100 px-1 rounded">{org.license_number || 'N/A'}</span></p>
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                        <span className={`text-[11px] font-black uppercase tracking-wider ${org.verification_status === 'verified' ? 'text-emerald-600' : 'text-amber-500 animate-pulse'}`}>{org.verification_status}</span>
                        {org.verification_status === 'pending' && (
                          <div className="flex gap-3">
                            <button onClick={() => handleVerifyOrphanage(org.id, 'verified')} className="text-xs text-emerald-600 font-bold hover:text-emerald-700 hover:underline">Approve</button>
                            <button onClick={() => handleVerifyOrphanage(org.id, 'rejected')} className="text-xs text-red-600 font-bold hover:text-red-700 hover:underline">Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-3 text-center text-slate-500 py-10 bg-[#f8fafc] rounded-2xl border border-dashed border-slate-200 font-medium">No orphanages found.</div>
                  )}
                </div>
              </section>

              {/* 📝 Admissions Section */}
              <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm scroll-mt-10" id="admissions">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Admissions & Applications</h3>
                    <p className="text-[15px] text-slate-500 mt-2">Cross-institutional registration requests and enrollment logs</p>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-[15px]">
                    <thead>
                      <tr className="bg-[#f8fafc] text-slate-500 text-xs uppercase tracking-wider font-black border-b border-slate-200">
                        <th className="py-4 px-6">Child Name</th>
                        <th className="py-4 px-6">Destination</th>
                        <th className="py-4 px-6">Parent</th>
                        <th className="py-4 px-6">Date Submitted</th>
                        <th className="py-4 px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { child: 'Emma Stone', target: 'Little Stars Daycare', parent: 'John Stone', date: 'June 01, 2026', status: 'Approved' },
                        { child: 'Liam Neeson', target: 'Rainbow Learning Center', parent: 'Sarah Neeson', date: 'May 28, 2026', status: 'Pending Review' },
                        { child: 'Noah Miller', target: 'Happy Hearts Childcare', parent: 'Lisa Miller', date: 'May 27, 2026', status: 'Approved' }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="py-4 px-6 font-bold text-slate-900">{row.child}</td>
                          <td className="py-4 px-6 text-slate-600 font-medium">{row.target}</td>
                          <td className="py-4 px-6 text-slate-600">{row.parent}</td>
                          <td className="py-4 px-6 text-slate-500 font-mono text-sm">{row.date}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-md text-[11px] uppercase tracking-wider font-black ${row.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{row.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 👧 Children Registry */}
              <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm scroll-mt-10" id="children">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Active Children Registry</h3>
                    <p className="text-[15px] text-slate-500 mt-2">Ecosystem-wide list of children with active care status</p>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {[
                    { name: 'Emma Stone', age: '4 yrs', care: 'Daycare Mode', details: 'Assigned: Lisa Thompson (Teacher)' },
                    { name: 'Liam Miller', age: '3 yrs', care: 'Nanny Assigned', details: 'Assigned: Kamrun Nahar (Nanny)' }
                  ].map((child, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-2xl p-5 flex items-center gap-5 bg-white hover:border-[#a855f7] hover:shadow-md transition">
                      <div className="text-3xl w-16 h-16 bg-[#f8fafc] rounded-full flex items-center justify-center border border-slate-200 shadow-sm shrink-0">👧</div>
                      <div>
                        <h4 className="font-black text-slate-900 text-lg">{child.name} <span className="text-sm text-slate-400 font-medium tracking-wide">({child.age})</span></h4>
                        <p className="text-[13px] text-[#a855f7] font-bold mt-1 uppercase tracking-wider">{child.care}</p>
                        <p className="text-[14px] text-slate-500 mt-1.5 font-medium bg-slate-50 px-2 py-1 inline-block rounded border border-slate-100">{child.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 🛡️ Safety & CCTV Monitoring */}
              <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm scroll-mt-10" id="safety">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Live Safety & CCTV Center</h3>
                    <p className="text-[15px] text-slate-500 mt-2">Safe zone tracking, system telemetry, and nursery camera feeds</p>
                  </div>
                  <span className="flex h-4 w-4 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 shadow-sm border-2 border-white"></span>
                  </span>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="border border-slate-800 rounded-3xl overflow-hidden shadow-2xl bg-slate-950 aspect-video flex flex-col justify-between p-6 text-white relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.8)_100%)]"></div>
                    <div className="flex justify-between items-center relative z-10">
                      <span className="bg-red-600 text-[10px] uppercase tracking-widest px-3 py-1 font-black rounded-md shadow-sm border border-red-500 animate-pulse">REC CH-01</span>
                      <span className="text-xs font-mono font-bold text-slate-300 bg-white/10 px-3 py-1 rounded backdrop-blur">Playground East</span>
                    </div>
                    <div className="text-center py-6 text-slate-400 text-sm relative z-10">
                      <p className="text-6xl mb-4 drop-shadow-lg">🧒🏕️</p>
                      <p className="font-mono text-[11px] font-bold tracking-widest text-emerald-400">FEED ONLINE • 30 FPS</p>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold tracking-wider text-slate-400 relative z-10">
                      <span className="bg-white/10 px-2 py-1 rounded backdrop-blur">1080p HD</span>
                      <span className="font-mono">2026-06-03 02:04</span>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <h4 className="font-black text-slate-900 text-lg">Active Safe Zones</h4>
                    {[
                      { zone: 'Little Stars Playground', radius: '500m', alerts: '0 deviations', status: 'Nominal' },
                      { zone: 'Gulshan Nanny Route', radius: '1.2km', alerts: '1 deviation resolved', status: 'Nominal' }
                    ].map((sz, idx) => (
                      <div key={idx} className="border border-slate-200 p-5 bg-white shadow-sm rounded-2xl flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-slate-900">{sz.zone}</h5>
                          <p className="text-[13px] text-slate-500 mt-1 font-medium">Radius: <span className="font-mono bg-slate-100 px-1 rounded">{sz.radius}</span> • {sz.alerts}</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] uppercase tracking-wider font-black">{sz.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 💬 Support tickets & Escrow disputes */}
              <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm scroll-mt-10" id="support">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Dispute & Support Resolution</h3>
                    <p className="text-[15px] text-slate-500 mt-2">Resolve platform complaints and payment disputes</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { user: 'Sarah Miller (Parent)', title: 'Nanny session hours discrepancy', id: 'TKT-9912', priority: 'High', status: 'Under Review' },
                    { user: 'Maria Mim (Nanny)', title: 'Escrow release processing delay', id: 'TKT-9854', priority: 'Medium', status: 'Resolved' }
                  ].map((ticket, idx) => (
                    <div key={idx} className="p-5 border border-slate-200 bg-white rounded-2xl hover:border-[#a855f7] hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <span className="text-[11px] font-black text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded tracking-wider">ID: {ticket.id}</span>
                        <h4 className="font-bold text-slate-900 mt-2 text-[17px]">{ticket.title}</h4>
                        <p className="text-[14px] text-slate-500 mt-1 font-medium">Created by: <span className="text-slate-700 font-semibold">{ticket.user}</span></p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 shrink-0 mt-2 md:mt-0">
                        <span className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${ticket.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>{ticket.priority}</span>
                        <span className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'}`}>{ticket.status}</span>
                        <button onClick={() => alert(`Opening details for ${ticket.id}`)} className="px-5 py-2.5 bg-slate-900 hover:bg-[#a855f7] text-white rounded-xl text-sm font-bold transition shadow-sm">Resolve</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
