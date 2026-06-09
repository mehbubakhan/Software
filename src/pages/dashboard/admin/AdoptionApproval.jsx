import React, { useState } from 'react';
import { Baby, Search, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AdoptionApproval() {
  const [search, setSearch] = useState('');
  
  const mockOrphanages = [
    { id: 501, orgName: 'Hope Orphanage', license: 'Verified', capacity: 45, risk: 'Safe', approval: 'Approved' },
    { id: 502, orgName: 'New Beginnings Agency', license: 'Pending', capacity: 120, risk: 'Under Review', approval: 'Pending' },
    { id: 503, orgName: 'Global Child Rescue', license: 'Invalid', capacity: 0, risk: 'Flagged', approval: 'Suspended' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Baby className="w-8 h-8 text-rose-500" /> Adoption Registration Approval
          </h1>
          <p className="text-slate-500 font-medium mt-2">Highly secure verification of orphanages, adoption agencies, and legal partners.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search organizations..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none w-full md:w-80 font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[15px]">
            <thead>
              <tr className="bg-[#f8fafc] text-slate-500 text-xs uppercase tracking-wider font-black border-b border-slate-200">
                <th className="py-4 px-6">Organization Name</th>
                <th className="py-4 px-6">License Status</th>
                <th className="py-4 px-6">Child Capacity</th>
                <th className="py-4 px-6">Risk Status</th>
                <th className="py-4 px-6">Verification Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockOrphanages.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-6 font-bold text-slate-900">{org.orgName}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${org.license === 'Verified' ? 'bg-emerald-50 text-emerald-700' : org.license === 'Invalid' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                      {org.license}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-medium">{org.capacity}</td>
                  <td className="py-4 px-6">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${org.risk === 'Safe' ? 'text-emerald-600' : org.risk === 'Flagged' ? 'text-red-600' : 'text-amber-600'}`}>
                      {org.risk === 'Safe' ? <ShieldCheck className="w-4 h-4" /> : org.risk === 'Flagged' ? <AlertTriangle className="w-4 h-4" /> : null} {org.risk}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${org.approval === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : org.approval === 'Suspended' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {org.approval}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition">Approve</button>
                      <button className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition">Investigate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
