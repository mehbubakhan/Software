import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Star, 
  Briefcase,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import Skeleton, { SkeletonOverviewCards } from '../../../components/Skeleton';

export default function Overview() {
  const navigate = useNavigate();
  const [safetyActive, setSafetyActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    name: 'Nanny',
    activeJobs: [],
    stats: {
      totalSessions: 0,
      totalHours: 0,
      rating: '4.8',
      verified: false,
      availabilityStatus: 'Available'
    },
    earningsHistory: [],
    recentActivities: []
  });

  useEffect(() => {
    fetch('http://localhost:5001/api/dashboard/nanny/overview', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(json => {
      if(json.ok && json.data) setData(json.data);
    })
    .catch(err => console.error("Error fetching overview", err))
    .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-4 max-w-6xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Skeleton className="h-20 w-full" />
        <SkeletonOverviewCards />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-6xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Good morning, {data.name.split(' ')[0]}! ☀️</h1>
          <p className="text-xs text-slate-500 mt-1">Nanny Specialist Portal — control center & schedules</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/dashboard/nanny/apply')} 
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus size={13} /> Find Jobs
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Profile Status', value: data.stats.verified ? 'Verified' : 'Pending', desc: 'Background check', color: 'text-emerald-600', icon: ShieldCheck, bg: 'bg-emerald-50' },
          { label: 'Trust Rating', value: `${data.stats.rating} / 5`, desc: `${data.stats.totalSessions} sessions`, color: 'text-amber-500', icon: Star, bg: 'bg-amber-50' },
          { label: 'Active Jobs', value: `${data.activeJobs.length} Running`, desc: 'Live tracking nominal', color: 'text-blue-600', icon: Briefcase, bg: 'bg-blue-50' },
          { label: 'Escrow Earnings', value: `৳${(data.stats.totalHours * 200).toLocaleString()}`, desc: 'This month payouts', color: 'text-purple-600', icon: DollarSign, bg: 'bg-purple-50' }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.label}</span>
                <div className={`p-1.5 rounded-lg ${card.bg}`}>
                  <Icon size={14} className={card.color} />
                </div>
              </div>
              <div className="mt-4">
                <p className={`text-2xl font-extrabold text-slate-900`}>{card.value}</p>
                <p className="mt-0.5 text-[10px] text-slate-500 font-semibold">{card.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl p-5 bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-950">Earnings & Hours Overview</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Telemetry metrics — Last 6 Months</p>
            </div>
            <TrendingUp size={16} className="text-purple-500" />
          </div>
          
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.earningsHistory}>
              <defs>
                <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: 12, fontSize: 11, color: "#fff" }} />
              <Area type="monotone" dataKey="earnings" stroke="#a855f7" fill="url(#earnGrad)" strokeWidth={2} name="Earnings (৳)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Safety Telemetry Control */}
        <div className="rounded-2xl p-5 bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-950">GPS Safe-Route Check</h3>
              <div className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${safetyActive ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${safetyActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Location tracking checks safe zone geofences. If safety check is enabled, parental live notification alerts will fire upon zone deviation.
            </p>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100/50">
              <span className="text-xs font-bold text-slate-700">Auto-sharing GPS</span>
              <button 
                onClick={() => setSafetyActive(!safetyActive)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${safetyActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${safetyActive ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="mt-6 bg-[#fffbeb] border border-amber-100 p-3.5 rounded-xl flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[10px] text-amber-800 leading-relaxed">
              <span className="font-bold">Next Payout:</span> Escrow clearing Scheduled for Friday 6:00 PM.
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activities split */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Care Contracts */}
        <div className="rounded-2xl p-5 bg-white border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-950">Active Care Contracts</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Nominal Status</span>
          </div>

          <div className="space-y-3">
            {data.activeJobs.length === 0 && <p className="text-xs text-slate-500">No active care contracts right now.</p>}
            {data.activeJobs.map((job, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{job.family}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{job.duration} • {job.area}</p>
                </div>
                <span className="text-xs font-black text-slate-950">{job.rate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities list */}
        <div className="rounded-2xl p-5 bg-white border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-950 mb-4">Workspace Logs</h3>
          <div className="space-y-3">
            {data.recentActivities.map((act) => {
              const dotColors = { green: 'bg-emerald-500', purple: 'bg-purple-500', blue: 'bg-blue-500', cyan: 'bg-cyan-500' };
              return (
                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotColors[act.color] || 'bg-slate-400'}`} />
                  <div className="flex-1">
                    <p className="text-slate-800 leading-tight">{act.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
