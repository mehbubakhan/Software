import React, { useState, useEffect } from 'react';
import { LifeBuoy, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../../services/api';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/admin/complaints');
      if (res.data?.ok) setComplaints(res.data.data);
    } catch (err) {
      console.error("Failed to load complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleResolve = async (id) => {
    try {
      await api.patch(`/admin/complaints/${id}/resolve`);
      fetchComplaints();
    } catch (err) {
      console.error("Failed to resolve complaint", err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <LifeBuoy className="w-8 h-8 text-orange-600" /> Complaints & Reports
        </h1>
        <p className="text-slate-500 font-medium mt-2 text-lg">Manage disputes, safety concerns, and payment issues.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
        <div className="space-y-4">
          {complaints.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle2 className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">No Open Complaints!</h3>
              <p className="text-slate-500 font-medium mt-2">The platform is running smoothly.</p>
            </div>
          ) : (
            complaints.map(c => (
              <div key={c.id} className="p-6 border border-slate-200 hover:border-orange-300 bg-white rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm transition">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-black text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded tracking-wider">ID: #{c.id}</span>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${c.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                      {c.priority} Priority
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                      {c.status}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-slate-900 text-lg mt-3">{c.complaint_type}</h4>
                  <p className="text-[15px] text-slate-600 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100">{c.description}</p>
                  
                  <div className="flex gap-6 mt-4">
                    <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5">
                      <span className="font-bold text-slate-700">Reporter:</span> {c.reporter_name || `User #${c.reporter_id}`}
                    </p>
                    {c.target_user_id && (
                      <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5">
                        <span className="font-bold text-slate-700">Reported User:</span> {c.target_name || `User #${c.target_user_id}`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                  {c.status !== 'Resolved' && (
                    <button 
                      onClick={() => handleResolve(c.id)} 
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm transition w-full"
                    >
                      Mark as Resolved
                    </button>
                  )}
                  <button className="px-6 py-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition w-full">
                    View Full Details
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
