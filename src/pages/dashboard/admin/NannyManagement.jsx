import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Star, MapPin, Briefcase, HeartHandshake } from 'lucide-react';
import api from '../../../services/api';

export default function NannyManagement() {
  const [nannies, setNannies] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        if (res.data?.ok) {
          setNannies(res.data.data.filter(u => u.role === 'nanny'));
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    fetchUsers();
  }, []);

  const filteredNannies = nannies.filter(n => 
    n.name?.toLowerCase().includes(search.toLowerCase()) || 
    n.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-purple-600" /> Nanny Management
          </h1>
          <p className="text-slate-500 font-medium mt-2">Monitor nanny activity, ratings, and job history.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search nannies..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none w-full md:w-80 font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNannies.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium bg-white rounded-2xl border border-slate-200">
            No nannies found matching your search.
          </div>
        ) : (
          filteredNannies.map(nanny => (
            <div key={nanny.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xl border border-purple-200">
                    {nanny.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{nanny.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500 mt-0.5">
                      <Star className="w-4 h-4 fill-amber-500" /> 4.9 <span className="text-slate-400 font-medium ml-1">(24 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <Briefcase className="w-4 h-4 text-slate-400" /> 12 Completed Jobs
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <HeartHandshake className="w-4 h-4 text-purple-400" /> 98% Compatibility Avg
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm">View Profile</button>
                <button className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm">Suspend</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
