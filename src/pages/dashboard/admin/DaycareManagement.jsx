import React, { useState, useEffect } from 'react';
import { Building, Search, MoreVertical, ShieldCheck, MapPin, Users } from 'lucide-react';
import api from '../../../services/api';

export default function DaycareManagement() {
  const [daycares, setDaycares] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        if (res.data?.ok) {
          setDaycares(res.data.data.filter(u => u.role === 'daycare'));
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    fetchUsers();
  }, []);

  const filteredDaycares = daycares.filter(d => 
    d.name?.toLowerCase().includes(search.toLowerCase()) || 
    d.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Building className="w-8 h-8 text-indigo-600" /> Daycare Management
          </h1>
          <p className="text-slate-500 font-medium mt-2">Manage registered daycare centers, safety compliance, and active children.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search daycares..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full md:w-80 font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDaycares.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium bg-white rounded-2xl border border-slate-200">
            No daycares found matching your search.
          </div>
        ) : (
          filteredDaycares.map(daycare => (
            <div key={daycare.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition group">
              <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                <div className="absolute -bottom-8 left-6 w-16 h-16 bg-white rounded-xl shadow-md border-4 border-white flex items-center justify-center text-indigo-600">
                  <Building className="w-8 h-8" />
                </div>
                <div className="absolute top-4 right-4">
                  <button className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white transition">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="pt-10 p-6">
                <h3 className="text-xl font-black text-slate-900">{daycare.name}</h3>
                <p className="text-[13px] text-slate-500 font-medium mt-1 mb-4">{daycare.email}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                    <p className="text-sm font-bold flex items-center gap-1.5 text-emerald-600">
                      <ShieldCheck className="w-4 h-4" /> Verified
                    </p>
                  </div>
                  <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Children</p>
                    <p className="text-sm font-bold flex items-center gap-1.5 text-slate-700">
                      <Users className="w-4 h-4 text-indigo-500" /> 45 Active
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition">View Dashboard</button>
                  <button className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition">Suspend</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
