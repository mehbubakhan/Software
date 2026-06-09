import React from 'react';
import { Video } from 'lucide-react';

export default function ChildMonitoring() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Video className="w-8 h-8 text-blue-500" /> Child Monitoring
        </h1>
        <p className="text-slate-500 font-medium mt-2">Live camera feeds and safety checks. (Phase 2 Integration)</p>
      </div>
      <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
        <p className="text-slate-500 font-bold">Child monitoring capabilities are coming soon.</p>
      </div>
    </div>
  );
}
