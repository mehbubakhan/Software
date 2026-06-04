import React from 'react';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  Briefcase,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Good morning, Sarah! ☀️</h1>
        <p className="text-slate-500 text-[15px]">Here is what is happening with your work today.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Profile Status */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-slate-700 text-sm">Profile Status</span>
          </div>
          <div className="text-2xl font-black text-slate-900">Verified</div>
          <div className="text-emerald-600 text-xs font-bold mt-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">Background Check Pass</div>
        </div>

        {/* Trust Score */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-700 text-sm">Trust Score</span>
          </div>
          <div className="text-2xl font-black text-slate-900">4.8 <span className="text-lg text-slate-400 font-medium">/ 5</span></div>
          <div className="text-slate-500 text-xs mt-1">Based on 14 parent reviews</div>
        </div>

        {/* Active Job Status */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-slate-700 text-sm">Active Job</span>
          </div>
          <div className="text-xl font-black text-slate-900">Not Working</div>
          <div className="text-blue-600 text-xs font-bold mt-1 bg-blue-50 w-fit px-2 py-0.5 rounded-full">Available for jobs</div>
        </div>

        {/* Today's Safety Status (UNIQUE IDEA) */}
        <div className="bg-[#f0fdf4] rounded-2xl border border-emerald-100 p-5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-emerald-900 text-sm">Today's Safety</span>
          </div>
          <div className="text-2xl font-black text-emerald-700">Safe</div>
          <div className="text-emerald-600 text-xs font-medium mt-1">Location tracking offline</div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Schedule & Recommendations) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#a855f7]" /> Today's Schedule
              </h2>
              <button 
                onClick={() => navigate('/dashboard/nanny/availability')}
                className="text-[#a855f7] text-sm font-bold hover:underline"
              >
                View full calendar
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-slate-500 uppercase">May</span>
                  <span className="text-lg font-black text-[#a855f7] leading-none mt-0.5">27</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">Video Interview - Ahmed Family</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 6:00 PM - 6:30 PM</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Online</span>
                  </div>
                </div>
                <button className="self-center bg-[#a855f7] hover:bg-[#9333ea] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Job Recommendations */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" /> Job Recommendations
              </h2>
              <button 
                onClick={() => navigate('/dashboard/nanny/apply')}
                className="text-blue-600 text-sm font-bold hover:underline"
              >
                View all jobs
              </button>
            </div>

            <div className="space-y-4">
              <div className="border border-slate-100 rounded-xl p-5 hover:border-blue-100 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Full-time Infant Care</h3>
                  <span className="bg-[#f0f9ff] text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-black">92% MATCH</span>
                </div>
                <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
                  <span>৳25,000/mo</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>Gulshan, Dhaka</span>
                </div>
                <div className="bg-[#fdf4ff] border border-[#f3e8ff] p-2.5 rounded-lg text-xs text-[#a855f7] font-medium flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-current" /> Matched because you have 2+ years of newborn experience.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Earnings & SOS) */}
        <div className="space-y-6">
          
          {/* Quick SOS Button */}
          <div className="bg-[#d90429] rounded-2xl p-6 shadow-md border border-red-800 relative overflow-hidden">
            <AlertTriangle className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-10" />
            <h2 className="text-xl font-bold text-white mb-2 relative z-10">Emergency?</h2>
            <p className="text-red-100 text-sm mb-6 relative z-10">Use this if you are in immediate danger.</p>
            <button 
              onClick={() => navigate('/dashboard/nanny/safety')}
              className="w-full bg-white text-[#d90429] font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-sm relative z-10"
            >
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" /> QUICK SOS
            </button>
          </div>

          {/* Earnings Summary */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-emerald-500" /> Earnings Summary
            </h2>
            
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 mb-4">
              <div className="text-sm font-bold text-emerald-800 mb-1">This Month</div>
              <div className="text-3xl font-black text-emerald-600">৳80,000</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Pending Escrow</span>
                <span className="font-bold text-slate-900">৳18,000</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-600">Next Payout</span>
                <span className="font-bold text-slate-900">May 30</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/dashboard/nanny/payments')}
              className="w-full mt-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-colors border border-slate-200"
            >
              View Payment History
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
