import React, { useState, useEffect } from 'react';
import { Users, Search, CreditCard, Activity } from 'lucide-react';
import api from '../../../services/api';

export default function ParentManagement() {
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        if (res.data?.ok) {
          setParents(res.data.data.filter(u => u.role === 'parent'));
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    fetchUsers();
  }, []);

  const filteredParents = parents.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" /> Parent Management
          </h1>
          <p className="text-slate-500 font-medium mt-2">Monitor parent accounts, active jobs, and payment statuses.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search parents..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-80 font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParents.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium bg-white rounded-2xl border border-slate-200">
            No parents found matching your search.
          </div>
        ) : (
          filteredParents.map(parent => (
            <div key={parent.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition border-t-4 border-t-blue-500">
              <h3 className="text-xl font-black text-slate-900 mb-1">{parent.name}</h3>
              <p className="text-[13px] text-slate-500 font-medium mb-5">{parent.email}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-600 font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-slate-400" /> Active Jobs</span>
                  <span className="font-black text-slate-900">2</span>
                </div>
                <div className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-600 font-bold flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-400" /> Payment Status</span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-black uppercase tracking-wider">Good</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm">View Profile</button>
                <button className="px-4 py-2.5 bg-white border-2 border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm">Suspend</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
