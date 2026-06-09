import React, { useState } from 'react';
import { BarChart2, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('month'); // week, month, year

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-blue-600" /> Platform Analytics
          </h1>
          <p className="text-slate-500 font-medium mt-2">Track growth, revenue, and active childcare demand over time.</p>
        </div>
        
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 shadow-sm"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Total Users</p>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <h3 className="text-3xl font-black text-slate-900">4,521</h3>
          </div>
          <p className="text-sm font-bold text-emerald-500 mt-4 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> +12% from last {timeRange}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Total Revenue</p>
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-500" />
            <h3 className="text-3xl font-black text-slate-900">৳24.5M</h3>
          </div>
          <p className="text-sm font-bold text-emerald-500 mt-4 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> +8% from last {timeRange}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Active Jobs</p>
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-500" />
            <h3 className="text-3xl font-black text-slate-900">186</h3>
          </div>
          <p className="text-sm font-bold text-emerald-500 mt-4 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> +24% from last {timeRange}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Emergency Incidents</p>
          <div className="flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-orange-500" />
            <h3 className="text-3xl font-black text-slate-900">3</h3>
          </div>
          <p className="text-sm font-bold text-emerald-500 mt-4 flex items-center gap-1">↓ -40% from last {timeRange}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center py-20">
        <BarChart2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900">Interactive Charts Loading</h3>
        <p className="text-slate-500 font-medium mt-2">D3.js integration for visual charts is planned for Phase 3.</p>
      </div>
    </div>
  );
}
