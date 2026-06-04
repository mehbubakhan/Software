import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { AlertTriangle, ShieldCheck, CheckCircle, XCircle } from 'lucide-react'
import api from '../../services/api'

const items = [
  {label:'Overview', path:'/dashboard/admin'},
  {label:'Nanny Verification', path:'/dashboard/admin#verification'},
  {label:'SOS Emergencies', path:'/dashboard/admin#sos'},
  {label:'Organizations', path:'/dashboard/admin#organizations'},
  {label:'Admissions', path:'/dashboard/admin#admissions'},
  {label:'Children', path:'/dashboard/admin#children'},
  {label:'Safety & CCTV', path:'/dashboard/admin#safety'},
  {label:'Support', path:'/dashboard/admin#support'}
]

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

  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 md:flex">
      <Sidebar items={items} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <section className="mb-6 rounded-lg border border-white bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Smart Nanny Ecosystem Platform</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              {isDaycare ? 'Daycare Admin Dashboard' : 'System Admin Control Center'}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Manage nanny and organization verifications, monitor live active work sessions, respond to SOS emergencies, and oversee the entire childcare ecosystem.
            </p>
          </div>
          {isSystemAdmin && (
            <ShieldCheck className="h-16 w-16 text-cyan-700 opacity-20" />
          )}
        </section>

        {isSystemAdmin && (
          <>
            <section className="grid gap-4 md:grid-cols-4 mb-6">
              {metrics.map(([label, value, note], i) => (
                <div key={label} className={`rounded-lg border p-5 shadow-sm ${i === 2 && value > 0 ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'}`}>
                  <p className={`text-sm font-bold ${i === 2 && value > 0 ? 'text-red-600' : 'text-slate-500'}`}>{label}</p>
                  <p className={`mt-2 text-3xl font-black ${i === 2 && value > 0 ? 'text-red-700 animate-pulse' : 'text-cyan-700'}`}>{value}</p>
                  <p className={`mt-1 text-sm font-semibold ${i === 2 && value > 0 ? 'text-red-800' : 'text-slate-600'}`}>{note}</p>
                </div>
              ))}
            </section>

            <section className="mb-6 rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm relative overflow-hidden" id="sos">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <AlertTriangle className="h-32 w-32 text-red-900" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                {activeSOS.length > 0 && (
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                  </div>
                )}
                <h3 className="text-xl font-black text-red-950">Live SOS Emergency Center</h3>
              </div>
              
              <div className="grid gap-4">
                {activeSOS.length === 0 ? (
                   <p className="text-sm font-bold text-slate-500 bg-white p-4 rounded-xl border border-red-100 text-center">No active SOS emergencies right now.</p>
                ) : (
                  activeSOS.map(sos => (
                    <div key={sos.id} className="bg-white border border-red-100 p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-red-600 uppercase tracking-wider">{sos.category} • {sos.time}</p>
                        <h4 className="text-lg font-black text-slate-900 mt-1">Nanny: {sos.nanny}</h4>
                        <p className="text-sm text-slate-600 font-mono mt-1">Location: {sos.location}</p>
                        <p className="text-sm text-slate-600 mt-1 font-semibold">Message: {sos.message}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-slate-900 transition">Contact Nanny</button>
                        <button onClick={() => handleSOSResolve(sos.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-red-700 transition">Resolve Issue</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="mb-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" id="verification">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-slate-950">Pending Verifications</h3>
                  <span className="text-sm font-bold text-cyan-600 hover:underline cursor-pointer">View All</span>
                </div>
                <div className="space-y-4">
                  {pendingVerifications.length === 0 ? (
                    <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Nanny</span>
                          <h4 className="font-bold text-slate-900">Kamrun Nahar</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Docs: National ID, Childcare Certification</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => alert('Approved Kamrun Nahar')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Approve">
                          <CheckCircle className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    pendingVerifications.map(v => (
                      <div key={v.id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.type === 'Organization' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{v.type}</span>
                            <h4 className="font-bold text-slate-900">{v.name}</h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Docs: {v.docs.join(', ')}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleVerify(v.id, 'Approved')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Approve">
                            <CheckCircle className="h-6 w-6" />
                          </button>
                          <button onClick={() => handleVerify(v.id, 'Rejected')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Reject">
                            <XCircle className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black text-slate-950 mb-4">Platform Health & Monitoring</h3>
                <div className="space-y-3 text-sm text-slate-700 font-medium">
                  <div className="flex justify-between p-3 bg-emerald-50 text-emerald-800 rounded-lg">
                    <span>Active Escrow Salary Payments</span>
                    <span className="font-bold">$4,520 processing</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span>Smart Matches Completed Today</span>
                    <span className="font-bold text-cyan-700">142 successful matches</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span>Safe Zone Deviations (Last 24h)</span>
                    <span className="font-bold text-amber-600">8 alerts triggered</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span>Payment Disputes Pending</span>
                    <span className="font-bold text-red-600">3 cases open</span>
                  </div>
                </div>
                <button onClick={() => alert('Detailed platform telemetry loading...')} className="mt-4 w-full text-center text-sm font-bold text-slate-500 hover:text-slate-900 transition">Open Full Analytics Dashboard</button>
              </div>
            </section>

            {/* 🏢 Organizations Section */}
            <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm scroll-mt-6" id="organizations">
              <div className="flex items-center justify-between mb-4 border-b pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950">Ecosystem Organizations</h3>
                  <p className="text-sm text-slate-500 mt-1">Verified partner daycares, schools, and care agencies</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">12 Registered</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {orphanages.length > 0 ? orphanages.map((org, idx) => (
                  <div key={idx} className="border border-slate-100 p-4 rounded-xl hover:shadow-md transition bg-slate-50/50">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-fuchsia-100 text-fuchsia-700">Orphanage</span>
                    <h4 className="font-bold text-slate-900 mt-2">{org.orphanage_name}</h4>
                    <p className="text-xs text-slate-500 mt-1">License: {org.license_number || 'N/A'}</p>
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                      <span className={`text-xs font-semibold ${org.verification_status === 'verified' ? 'text-emerald-600' : 'text-amber-500 animate-pulse'}`}>{org.verification_status}</span>
                      {org.verification_status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleVerifyOrphanage(org.id, 'verified')} className="text-xs text-emerald-600 font-bold hover:underline">Approve</button>
                          <button onClick={() => handleVerifyOrphanage(org.id, 'rejected')} className="text-xs text-red-600 font-bold hover:underline">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="col-span-3 text-center text-slate-500 py-4">No orphanages found.</div>
                )}
              </div>
            </section>

            {/* 📝 Admissions Section */}
            <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm scroll-mt-6" id="admissions">
              <div className="flex items-center justify-between mb-4 border-b pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950">Admissions & Applications</h3>
                  <p className="text-sm text-slate-500 mt-1">Cross-institutional registration requests and enrollment logs</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold">
                      <th className="py-2">Child Name</th>
                      <th className="py-2">Destination</th>
                      <th className="py-2">Parent</th>
                      <th className="py-2">Date Submitted</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { child: 'Emma Stone', target: 'Little Stars Daycare', parent: 'John Stone', date: 'June 01, 2026', status: 'Approved' },
                      { child: 'Liam Neeson', target: 'Rainbow Learning Center', parent: 'Sarah Neeson', date: 'May 28, 2026', status: 'Pending Review' },
                      { child: 'Noah Miller', target: 'Happy Hearts Childcare', parent: 'Lisa Miller', date: 'May 27, 2026', status: 'Approved' }
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition">
                        <td className="py-3 font-bold text-slate-900">{row.child}</td>
                        <td className="py-3 text-slate-700">{row.target}</td>
                        <td className="py-3 text-slate-600">{row.parent}</td>
                        <td className="py-3 text-slate-500">{row.date}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${row.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 👧 Children Registry */}
            <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm scroll-mt-6" id="children">
              <div className="flex items-center justify-between mb-4 border-b pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950">Active Children Registry</h3>
                  <p className="text-sm text-slate-500 mt-1">Ecosystem-wide list of children with active care status</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { name: 'Emma Stone', age: '4 yrs', care: 'Daycare Mode', details: 'Assigned: Lisa Thompson (Teacher)' },
                  { name: 'Liam Miller', age: '3 yrs', care: 'Nanny Assigned', details: 'Assigned: Kamrun Nahar (Nanny)' }
                ].map((child, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 flex items-center gap-4 bg-slate-50">
                    <div className="text-2xl w-12 h-12 bg-white rounded-full flex items-center justify-center border shadow-sm">👧</div>
                    <div>
                      <h4 className="font-bold text-slate-900">{child.name} <span className="text-xs text-slate-400 font-normal">({child.age})</span></h4>
                      <p className="text-xs text-cyan-600 font-semibold mt-0.5">{child.care}</p>
                      <p className="text-xs text-slate-500 mt-1">{child.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 🛡️ Safety & CCTV Monitoring */}
            <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm scroll-mt-6" id="safety">
              <div className="flex items-center justify-between mb-4 border-b pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950">Live Safety & CCTV Center</h3>
                  <p className="text-sm text-slate-500 mt-1">Safe zone tracking, system telemetry, and nursery camera feeds</p>
                </div>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-slate-950 aspect-video flex flex-col justify-between p-4 text-white relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.8)_100%)]"></div>
                  <div className="flex justify-between items-center relative z-10">
                    <span className="bg-red-600 text-xs px-2 py-0.5 font-bold rounded animate-pulse">REC CH-01</span>
                    <span className="text-xs font-mono text-slate-300">Playground East</span>
                  </div>
                  <div className="text-center py-6 text-slate-400 text-sm relative z-10">
                    <p className="text-4xl mb-2">🧒🏕️</p>
                    <p className="font-mono text-xs">FEED ONLINE • 30 FPS</p>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400 relative z-10">
                    <span>1080p HD</span>
                    <span>2026-06-03 02:04</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900">Active Safe Zones</h4>
                  {[
                    { zone: 'Little Stars Playground', radius: '500m', alerts: '0 deviations', status: 'Nominal' },
                    { zone: 'Gulshan Nanny Route', radius: '1.2km', alerts: '1 deviation resolved', status: 'Nominal' }
                  ].map((sz, idx) => (
                    <div key={idx} className="border border-slate-100 p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-medium">
                      <div>
                        <h5 className="font-bold text-slate-900">{sz.zone}</h5>
                        <p className="text-slate-500 mt-1">Radius: {sz.radius} • {sz.alerts}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold">{sz.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 💬 Support tickets & Escrow disputes */}
            <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm scroll-mt-6" id="support">
              <div className="flex items-center justify-between mb-4 border-b pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950">Dispute & Support Resolution</h3>
                  <p className="text-sm text-slate-500 mt-1">Resolve platform complaints and payment disputes</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { user: 'Sarah Miller (Parent)', title: 'Nanny session hours discrepancy', id: 'TKT-9912', priority: 'High', status: 'Under Review' },
                  { user: 'Maria Mim (Nanny)', title: 'Escrow release processing delay', id: 'TKT-9854', priority: 'Medium', status: 'Resolved' }
                ].map((ticket, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <span className="text-xs text-slate-400 font-mono">ID: {ticket.id}</span>
                      <h4 className="font-bold text-slate-900 mt-0.5">{ticket.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">Created by: {ticket.user}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${ticket.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{ticket.priority}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'}`}>{ticket.status}</span>
                      <button onClick={() => alert(`Opening details for ${ticket.id}`)} className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs font-bold transition">Resolve</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
