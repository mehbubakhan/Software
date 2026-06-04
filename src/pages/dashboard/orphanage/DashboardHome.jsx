import React from 'react';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Home</h1>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Children', value: '12', subtitle: '3 available for adoption', color: 'border-violet-200 bg-violet-50 text-violet-700' },
          { title: 'Pending Applications', value: '5', subtitle: '2 under review', color: 'border-amber-200 bg-amber-50 text-amber-700' },
          { title: 'Upcoming Meetings', value: '3', subtitle: 'Next: Parent Interview', color: 'border-blue-200 bg-blue-50 text-blue-700' },
          { title: 'Risk Alerts', value: '0', subtitle: 'All systems normal', color: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
        ].map((card, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${card.color}`}>
            <h3 className="text-sm font-semibold opacity-80 uppercase tracking-wider">{card.title}</h3>
            <p className="text-3xl font-black mt-2">{card.value}</p>
            <p className="text-xs font-medium mt-1 opacity-90">{card.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Adoption Success Rate</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-2 pb-2 border-b border-l border-slate-100">
            {/* CSS-based Mock Chart */}
            {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
              <div key={i} className="w-12 bg-violet-200 rounded-t-md relative group hover:bg-violet-400 transition-colors" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium px-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-violet-50 border border-slate-100 hover:border-violet-100 rounded-lg font-semibold text-slate-700 hover:text-violet-700 transition">
              + Add Child Profile
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-violet-50 border border-slate-100 hover:border-violet-100 rounded-lg font-semibold text-slate-700 hover:text-violet-700 transition">
              📋 Review Applications
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-violet-50 border border-slate-100 hover:border-violet-100 rounded-lg font-semibold text-slate-700 hover:text-violet-700 transition">
              📅 Schedule Meeting
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-violet-50 border border-slate-100 hover:border-violet-100 rounded-lg font-semibold text-slate-700 hover:text-violet-700 transition">
              ☎️ Contact Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
