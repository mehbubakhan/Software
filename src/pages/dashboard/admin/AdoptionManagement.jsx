import React, { useState, useEffect } from 'react';
import { Baby, Users, Search, FileText, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import api from '../../../services/api';

export default function AdoptionManagement() {
  const [adoptions, setAdoptions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        const res = await api.get('/admin/adoption');
        if (res.data?.ok) {
          setAdoptions(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load adoptions:", err);
      }
    };
    fetchAdoptions();
  }, []);

  const filteredAdoptions = adoptions.filter(a => 
    a.parent_name?.toLowerCase().includes(search.toLowerCase()) || 
    a.child_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.orphanage_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Baby className="w-8 h-8 text-rose-500" /> Adoption Center Control
          </h1>
          <p className="text-slate-500 font-medium mt-2">Manage orphanages, adoption requests, and compliance.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search adoptions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none w-full md:w-80 font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[15px]">
            <thead>
              <tr className="bg-[#f8fafc] text-slate-500 text-xs uppercase tracking-wider font-black border-b border-slate-200">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Parent</th>
                <th className="py-4 px-6">Child</th>
                <th className="py-4 px-6">Orphanage</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdoptions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">No adoption applications found.</td>
                </tr>
              ) : (
                filteredAdoptions.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400">#{app.id}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <Users className="w-4 h-4 text-slate-400" />
                        </div>
                        {app.parent_name || `Parent ID: ${app.parent_id}`}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <Baby className="w-4 h-4 text-rose-400" /> {app.child_name || `Child ID: ${app.child_id}`}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {app.orphanage_name || `Org ID: ${app.orphanage_id}`}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${app.application_status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                        {app.application_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
