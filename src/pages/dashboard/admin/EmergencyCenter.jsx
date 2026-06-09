import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Phone, ShieldAlert, CheckCircle2 } from 'lucide-react';
import api from '../../../services/api';

export default function EmergencyCenter() {
  const [emergencies, setEmergencies] = useState([]);

  const fetchEmergencies = async () => {
    try {
      const res = await api.get('/admin/emergencies');
      if (res.data?.ok) setEmergencies(res.data.data);
    } catch (err) {
      console.error("Failed to load emergencies:", err);
    }
  };

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (id) => {
    try {
      await api.patch(`/admin/emergencies/${id}/resolve`);
      fetchEmergencies();
    } catch (err) {
      console.error("Failed to resolve emergency", err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-red-600 tracking-tight flex items-center gap-3">
          <AlertTriangle className="w-8 h-8" /> Live SOS Emergency Center
        </h1>
        <p className="text-slate-500 font-medium mt-2 text-lg">Monitor and respond to critical platform emergencies instantly.</p>
      </div>

      <div className="bg-white rounded-3xl border border-red-200 shadow-xl overflow-hidden p-6 md:p-8 relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <ShieldAlert className="h-48 w-48 text-red-900" />
        </div>
        
        <div className="space-y-4 relative z-10">
          {emergencies.length === 0 ? (
            <div className="text-center py-16 bg-[#f8fafc] border border-slate-200 rounded-2xl">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-slate-900">All Clear</h3>
              <p className="text-slate-500 font-medium mt-2">No active SOS emergencies right now.</p>
            </div>
          ) : (
            emergencies.map(sos => (
              <div key={sos.id} className="bg-white border-2 border-red-500 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse-slow">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-md border border-red-100">
                      {sos.type}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">ID: {sos.id}</span>
                  </div>
                  
                  <h4 className="font-bold text-slate-900 text-xl">User: {sos.user_name || `ID #${sos.user_id}`}</h4>
                  
                  <div className="mt-4 flex flex-col gap-2">
                    <p className="text-[15px] font-medium text-slate-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" /> Location: <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{sos.location || 'Unknown'}</span>
                    </p>
                    <p className="text-[15px] font-medium text-slate-700 bg-red-50 p-3 rounded-lg border border-red-100 mt-2">
                      <strong className="text-red-900">Message:</strong> {sos.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                  <button className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm transition w-full flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> Call User
                  </button>
                  <button 
                    onClick={() => handleResolve(sos.id)} 
                    className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition w-full flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark as Resolved
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
