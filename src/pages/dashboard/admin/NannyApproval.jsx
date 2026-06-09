import React, { useState } from 'react';
import { ClipboardList, Search, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function NannyApproval() {
  const [search, setSearch] = useState('');
  
  const mockNannies = [
    { id: 201, name: 'Nina Williams', experience: '5 Years', bgCheck: 'Cleared', approval: 'Approved' },
    { id: 202, name: 'Jessica Parker', experience: '2 Years', bgCheck: 'Pending', approval: 'Pending' },
    { id: 203, name: 'Mary Smith', experience: '10 Years', bgCheck: 'Submitted', approval: 'Pending' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-purple-500" /> Nanny Registration Approval
          </h1>
          <p className="text-slate-500 font-medium mt-2">Verify nanny background checks, experience, and safety compliance.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search nannies..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none w-full md:w-80 font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[15px]">
            <thead>
              <tr className="bg-[#f8fafc] text-slate-500 text-xs uppercase tracking-wider font-black border-b border-slate-200">
                <th className="py-4 px-6">Nanny Name</th>
                <th className="py-4 px-6">Experience</th>
                <th className="py-4 px-6">Background Check</th>
                <th className="py-4 px-6">Approval Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockNannies.map((nanny) => (
                <tr key={nanny.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-6 font-bold text-slate-900">{nanny.name}</td>
                  <td className="py-4 px-6 text-slate-700 font-medium">{nanny.experience}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${nanny.bgCheck === 'Cleared' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {nanny.bgCheck}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${nanny.approval === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {nanny.approval}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition">Approve</button>
                      <button className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition">Reject</button>
                      <button className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition">View Docs</button>
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
