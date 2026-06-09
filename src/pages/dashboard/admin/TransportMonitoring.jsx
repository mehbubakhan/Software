import React from 'react';
import { Video } from 'lucide-react';

export default function TransportMonitoring() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Video className="w-8 h-8 text-indigo-500" /> Transportation Monitoring
        </h1>
        <p className="text-slate-500 font-medium mt-2">Live GPS tracking and transport video feeds. (Phase 2 Integration)</p>
      </div>
      <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
        <p className="text-slate-500 font-bold">Transportation monitoring capabilities are coming soon.</p>
      </div>
    </div>
  );
}
