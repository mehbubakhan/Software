import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import api from '../../../services/api';

export default function Overview() {
  const [metrics, setMetrics] = useState({
    totalParents: 0,
    totalNannies: 0,
    totalDaycares: 0,
    pendingVerifications: 0,
    activeEmergencies: 0,
    pendingComplaints: 0,
    todayRevenue: 0
  });

  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/metrics');
        if(res.data?.ok) setMetrics(res.data.data);

        const sosRes = await api.get('/admin/emergencies');
        if(sosRes.data?.ok) setEmergencies(sosRes.data.data);
      } catch (err) {
        console.error("Failed to load overview data:", err);
      }
    };
    fetchDashboard();
  }, []);

  const roleCards = [
    {
      title: 'Total Parents',
      total: '1,250',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: 'bg-blue-100 text-blue-600',
      stats: [
        { label: 'Verified', value: '1,050', className: 'text-emerald-600' },
        { label: 'Pending', value: '120', className: 'text-amber-600' },
        { label: 'Suspended', value: '80', className: 'text-red-600' }
      ]
    },
    {
      title: 'Total Nannies',
      total: '430',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      icon: 'bg-purple-100 text-purple-600',
      stats: [
        { label: 'Verified', value: '350', className: 'text-emerald-600' },
        { label: 'Pending', value: '40', className: 'text-amber-600' },
        { label: 'Elite', value: '20', className: 'text-indigo-600' },
        { label: 'Suspended', value: '20', className: 'text-red-600' }
      ]
    },
    {
      title: 'Total Daycares',
      total: '52',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: 'bg-emerald-100 text-emerald-600',
      stats: [
        { label: 'Verified', value: '45', className: 'text-emerald-600' },
        { label: 'Pending', value: '5', className: 'text-amber-600' },
        { label: 'Suspended', value: '2', className: 'text-red-600' }
      ]
    },
    {
      title: 'Marketplace Sellers',
      total: '120',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: 'bg-amber-100 text-amber-600',
      stats: [
        { label: 'Approved', value: '90', className: 'text-emerald-600' },
        { label: 'Pending', value: '20', className: 'text-amber-600' },
        { label: 'Flagged', value: '10', className: 'text-orange-600' }
      ]
    },
    {
      title: 'Adoption Organizations',
      total: '18',
      color: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: 'bg-rose-100 text-rose-600',
      stats: [
        { label: 'Approved', value: '12', className: 'text-emerald-600' },
        { label: 'Pending', value: '4', className: 'text-amber-600' },
        { label: 'Suspended', value: '2', className: 'text-red-600' }
      ]
    },
    {
      title: 'Total Children',
      total: '2,450',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      icon: 'bg-indigo-100 text-indigo-600',
      stats: [
        { label: 'Daycare', value: '1,400', className: 'text-indigo-600' },
        { label: 'Nanny Care', value: '900', className: 'text-purple-600' },
        { label: 'Adoption System', value: '150', className: 'text-rose-600' }
      ]
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f172a] mb-2">Platform Control</p>
          <h2 className="text-3xl font-black text-slate-900">Dashboard Overview</h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-500">
            A Fully Verified Smart Childcare & Child Safety Ecosystem.
          </p>
        </div>
        <ShieldCheck className="h-20 w-20 text-slate-900 opacity-5" />
      </section>

      <div className="mb-4">
        <h3 className="text-xl font-black text-slate-900">Total Users System</h3>
        <p className="text-sm font-medium text-slate-500 mt-1">Detailed breakdown of platform roles and approval statuses.</p>
      </div>

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-10">
        {roleCards.map((card, i) => (
          <div key={i} className={`rounded-2xl border p-6 shadow-sm ${card.color}`}>
            <p className="text-xs font-black uppercase tracking-wider mb-2 opacity-80">{card.title}</p>
            <p className="text-4xl font-black mb-6">{card.total}</p>
            
            <div className="space-y-3 bg-white/60 p-4 rounded-xl border border-white/40">
              {card.stats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">{stat.label}</span>
                  <span className={`text-sm font-black ${stat.className}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-10 rounded-2xl border border-red-200 bg-[#fff1f2] p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <AlertTriangle className="h-48 w-48 text-red-900" />
        </div>
        <div className="flex items-center gap-4 mb-6 relative z-10">
          {emergencies.length > 0 && (
            <div className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500"></span>
            </div>
          )}
          <h3 className="text-2xl font-black text-red-950">Live Alerts Panel</h3>
        </div>
        
        <div className="grid gap-4 relative z-10">
          {emergencies.length === 0 ? (
            <p className="text-[15px] font-bold text-slate-500 bg-white p-6 rounded-xl border border-red-100 text-center shadow-sm">No active alerts right now.</p>
          ) : (
            emergencies.map(sos => (
              <div key={sos.id} className="bg-white border border-red-100 p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div>
                  <p className="text-xs font-black text-red-600 uppercase tracking-widest">{sos.type} • SOS Alert</p>
                  <h4 className="text-xl font-black text-slate-900 mt-2">User ID: {sos.user_id}</h4>
                  <p className="text-[15px] text-slate-600 font-mono mt-1 bg-slate-50 px-3 py-1 rounded inline-block border border-slate-100">Location: {sos.location || 'Unknown'}</p>
                  <p className="text-[15px] text-slate-700 mt-3 font-semibold bg-red-50 px-4 py-2 rounded-lg border border-red-100">Message: {sos.message}</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-slate-900 transition">Contact User</button>
                  <button className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-red-700 transition">Resolve Issue</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 mb-6">Quick Action Buttons</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Verify User', 'Approve Daycare', 'Open Emergency', 'Send Notification', 'View Reports'].map(action => (
            <button key={action} className="p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold transition-all text-sm text-center shadow-sm">
              {action}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
