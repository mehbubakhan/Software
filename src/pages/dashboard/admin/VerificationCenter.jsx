import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, FileText } from 'lucide-react';
import api from '../../../services/api';

export default function VerificationCenter() {
  const [verifications, setVerifications] = useState([]);

  const fetchVerifications = async () => {
    try {
      const res = await api.get('/admin/verifications');
      if (res.data?.ok) setVerifications(res.data.data);
    } catch (err) {
      console.error("Failed to load verifications:", err);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await api.patch(`/admin/verifications/${id}`, { status });
      fetchVerifications(); // refresh list
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600" /> Verification Center
        </h1>
        <p className="text-slate-500 font-medium mt-2 text-lg">Review and approve Nannies and Daycares to ensure platform safety.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
        <div className="space-y-4">
          {verifications.length === 0 ? (
            <div className="text-center py-16">
              <ShieldCheck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">All Caught Up!</h3>
              <p className="text-slate-500 font-medium mt-2">There are no pending verifications at the moment.</p>
            </div>
          ) : (
            verifications.map(v => (
              <div key={v.id} className="p-6 border border-slate-200 hover:border-blue-300 bg-[#f8fafc] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition shadow-sm">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${v.type === 'Organization' || v.type === 'Daycare' ? 'bg-[#fdf4ff] text-[#a855f7]' : 'bg-blue-100 text-blue-700'}`}>
                      {v.type}
                    </span>
                    <h4 className="font-bold text-slate-900 text-lg">{v.name}</h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {v.docs?.map(doc => (
                      <span key={doc} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                        <FileText className="w-3.5 h-3.5" /> {doc}
                      </span>
                    ))}
                  </div>
                  <p className="text-[13px] text-slate-400 mt-3 font-medium">Submitted on: {v.submitted_at || 'Just now'}</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <button 
                    onClick={() => handleVerify(v.id, 'Approved')} 
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Approve
                  </button>
                  <button 
                    onClick={() => handleVerify(v.id, 'Rejected')} 
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 hover:border-red-500 hover:bg-red-50 hover:text-red-600 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition"
                  >
                    <XCircle className="w-5 h-5" /> Reject
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
