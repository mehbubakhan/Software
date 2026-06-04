import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, FileText, Users, Home, ShieldCheck, HeartHandshake, AlertCircle } from 'lucide-react';

export default function AdoptionTracker() {
  const stages = [
    { id: 1, name: 'Application', status: 'completed', icon: FileText, date: 'May 10' },
    { id: 2, name: 'Doc Review', status: 'completed', icon: ShieldCheck, date: 'May 15' },
    { id: 3, name: 'Verification', status: 'active', icon: CheckCircle, date: 'In Progress' },
    { id: 4, name: 'Counseling', status: 'pending', icon: HeartHandshake },
    { id: 5, name: 'Child Matching', status: 'pending', icon: Users },
    { id: 6, name: 'Trial Meetings', status: 'pending', icon: Clock },
    { id: 7, name: 'Temp Placement', status: 'pending', icon: Home },
    { id: 8, name: 'Monitoring', status: 'pending', icon: ActivitySquare },
    { id: 9, name: 'Final Approval', status: 'pending', icon: CheckCircle },
    { id: 10, name: 'Legal Completion', status: 'pending', icon: FileText }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#0B132B]">Adoption Progress Tracker</h2>
      <p className="text-slate-500 mt-1">Track your adoption journey through our secure, verified 10‑stage process.</p>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-[#0B132B]">Application ID: #AD-84920</h3>
            <p className="text-slate-500 font-medium">Stage 3 of 10: Background Verification</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-bold text-sm">
            <Clock size={16} /> Under Review
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-slate-100 rounded-full" />
          <div className="space-y-8 relative z-10">
            {stages.map((stage, idx) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-start gap-6"
              >
                <div className={`w-12 h-12 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 transition-colors ${
                  stage.status === 'completed' ? 'bg-green-500 text-white' :
                  stage.status === 'active' ? 'bg-[#F4A261] text-white ring-4 ring-[#F4A261]/20' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  <stage.icon size={20} />
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-bold text-lg ${stage.status === 'pending' ? 'text-slate-400' : 'text-[#0B132B]'}`}>
                      {stage.id}. {stage.name}
                    </h4>
                    {stage.date && <span className="text-sm font-semibold text-slate-400">{stage.date}</span>}
                  </div>
                  {stage.status === 'active' && (
                    <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex gap-4">
                        <AlertCircle className="text-[#F4A261] shrink-0" />
                        <div>
                          <p className="font-semibold text-[#0B132B] mb-2">Government ID & Financial Check</p>
                          <p className="text-slate-600 text-sm mb-4">
                            Our team is currently verifying your submitted tax records and national identity documents. This process typically takes 3‑5 business days.
                          </p>
                          <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            Upload Additional Documents
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivitySquare(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M17 12h-2l-2 5-2-10-2 5H7" />
    </svg>
  );
}
