import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { AlertTriangle, ShieldCheck, CheckCircle, XCircle } from 'lucide-react'

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

const metrics = [
  ['Pending Nannies', '24', 'Needs verification'],
  ['Active Work Sessions', '186', 'Live tracking'],
  ['SOS Alerts', '2', 'CRITICAL - Action req.'],
  ['Organizations', '15', '3 pending approval']
]

const pendingVerifications = [
  { id: 101, name: 'Kamrun Nahar', type: 'Nanny', docs: ['NID', 'Police Clearance', 'Selfie'], status: 'Pending' },
  { id: 102, name: 'Caring Hearts Agency', type: 'Organization', docs: ['Trade License', 'Owner NID'], status: 'Pending' },
  { id: 103, name: 'Deedhity Dhara', type: 'Nanny', docs: ['NID', 'Medical', 'Selfie'], status: 'Pending' }
]

const activeSOS = [
  { id: 501, nanny: 'Maria Mim', category: 'Medical Emergency', location: 'Lat 23.79, Lng 90.41', time: '2 mins ago', status: 'Unresolved' },
  { id: 502, nanny: 'Samanta Khan', category: 'Unsafe Environment', location: 'Lat 23.81, Lng 90.42', time: '5 mins ago', status: 'Investigating' }
]

export default function AdminDashboard(){
  const { user } = useAuth() || {}
  const isDaycare = user?.role === 'daycare'
  const isSystemAdmin = user?.role === 'admin' || !isDaycare

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
                <div key={label} className={`rounded-lg border p-5 shadow-sm ${i === 2 ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'}`}>
                  <p className={`text-sm font-bold ${i === 2 ? 'text-red-600' : 'text-slate-500'}`}>{label}</p>
                  <p className={`mt-2 text-3xl font-black ${i === 2 ? 'text-red-700 animate-pulse' : 'text-cyan-700'}`}>{value}</p>
                  <p className={`mt-1 text-sm font-semibold ${i === 2 ? 'text-red-800' : 'text-slate-600'}`}>{note}</p>
                </div>
              ))}
            </section>

            <section className="mb-6 rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm relative overflow-hidden" id="sos">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <AlertTriangle className="h-32 w-32 text-red-900" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </div>
                <h3 className="text-xl font-black text-red-950">Live SOS Emergency Center</h3>
              </div>
              
              <div className="grid gap-4">
                {activeSOS.map(sos => (
                  <div key={sos.id} className="bg-white border border-red-100 p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-red-600 uppercase tracking-wider">{sos.category} • {sos.time}</p>
                      <h4 className="text-lg font-black text-slate-900 mt-1">Nanny: {sos.nanny}</h4>
                      <p className="text-sm text-slate-600 font-mono mt-1">Last known location: {sos.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-slate-900 transition">Contact Nanny</button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-red-700 transition">Dispatch Help / Escalate</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" id="verification">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-slate-950">Pending Verifications</h3>
                  <span className="text-sm font-bold text-cyan-600 hover:underline cursor-pointer">View All</span>
                </div>
                <div className="space-y-4">
                  {pendingVerifications.map(v => (
                    <div key={v.id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.type === 'Organization' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{v.type}</span>
                          <h4 className="font-bold text-slate-900">{v.name}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Docs: {v.docs.join(', ')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Approve">
                          <CheckCircle className="h-6 w-6" />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Reject">
                          <XCircle className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  ))}
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
                <button className="mt-4 w-full text-center text-sm font-bold text-slate-500 hover:text-slate-900 transition">Open Full Analytics Dashboard</button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
