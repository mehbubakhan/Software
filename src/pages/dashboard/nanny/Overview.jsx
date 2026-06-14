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
  Clock,
  HeartHandshake,
  CheckCircle2,
  Award,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Good morning, Sarah! ☀️</h1>
          <p className="text-slate-500 text-lg font-medium">Your nanny dashboard and childcare command center.</p>
        </div>
      </div>

      {/* Top Summary Cards (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Active Jobs */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Working</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Active Jobs</h2>
            <div className="space-y-1 mt-3">
              <p className="text-sm text-slate-600 font-medium">2 Current working jobs</p>
              <p className="text-sm text-slate-600 font-medium">1 Shift today</p>
              <p className="text-sm text-slate-600 font-medium">Assigned: Leo (3y)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <button onClick={() => navigate('/dashboard/nanny/active-jobs')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold py-2.5 rounded-xl transition-colors">View Jobs</button>
            <button onClick={() => navigate('/dashboard/nanny/active-jobs')} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">Start Shift</button>
          </div>
        </div>

        {/* Card 2: Earnings */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-emerald-600 font-black text-xl">৳1,250</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Earnings</h2>
            <div className="space-y-1 mt-3">
              <p className="text-sm text-slate-600 font-medium">Today: ৳1,250</p>
              <p className="text-sm text-slate-600 font-medium">Weekly: ৳8,400</p>
              <p className="text-sm text-slate-600 font-medium">Escrow: ৳4,000</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <button onClick={() => navigate('/dashboard/nanny/payments')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold py-2.5 rounded-xl transition-colors">History</button>
            <button onClick={() => navigate('/dashboard/nanny/payments')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">Withdraw</button>
          </div>
        </div>

        {/* Card 3: Trust Score */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 font-black text-xl text-purple-700"><Star className="w-5 h-5 fill-current" /> 4.9</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Trust Score</h2>
            <div className="space-y-1 mt-3">
              <p className="text-sm text-slate-600 font-medium flex justify-between">Safety <span>98%</span></p>
              <p className="text-sm text-slate-600 font-medium flex justify-between">Attendance <span>100%</span></p>
              <p className="text-sm text-slate-600 font-medium flex justify-between">Compatibility <span>94%</span></p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <button onClick={() => navigate('/dashboard/nanny/reviews')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold py-2.5 rounded-xl transition-colors">Reviews</button>
            <button onClick={() => navigate('/dashboard/nanny/profile')} className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">Improve</button>
          </div>
        </div>

        {/* Card 4: Verification Status */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="bg-amber-100 text-amber-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Level 2</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Verification Status</h2>
            <div className="space-y-1 mt-3">
              <p className="text-sm text-slate-600 font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> ID Verified</p>
              <p className="text-sm text-slate-600 font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Background Check</p>
              <p className="text-sm text-amber-600 font-medium flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Missing: CPR Cert</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <button onClick={() => navigate('/dashboard/nanny/verification')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold py-2.5 rounded-xl transition-colors">Upload Docs</button>
            <button onClick={() => navigate('/dashboard/nanny/verification')} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">Verify Now</button>
          </div>
        </div>

      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Schedule */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Calendar className="w-7 h-7 text-indigo-500" /> Today's Schedule
              </h2>
              <button onClick={() => navigate('/dashboard/nanny/availability')} className="text-indigo-600 text-sm font-bold hover:underline">
                Open Calendar
              </button>
            </div>

            <div className="space-y-4">
              {/* Shift Item */}
              <div className="flex gap-5 p-5 rounded-2xl border-2 border-indigo-50 bg-indigo-50/30 hover:border-indigo-100 transition-colors group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-black text-slate-400 uppercase">May</span>
                  <span className="text-xl font-black text-indigo-600 leading-none mt-1">27</span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">Afternoon Care - Rahman Family</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm font-medium text-slate-600">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> 2:00 PM - 6:00 PM</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> Dhanmondi, Dhaka</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow">
                    View Details
                  </button>
                </div>
              </div>

              {/* Interview Item */}
              <div className="flex gap-5 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors bg-white group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-black text-slate-400 uppercase">May</span>
                  <span className="text-xl font-black text-slate-700 leading-none mt-1">27</span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">Video Interview - Khan Family</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm font-medium text-slate-600">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> 7:00 PM - 7:30 PM</span>
                    <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md"><Briefcase className="w-3.5 h-3.5" /> Online Meeting</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <button className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-3 rounded-xl text-sm font-bold transition-all">
                    Join Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Quick SOS Button (Always visible logic) */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 shadow-xl border border-red-900 relative overflow-hidden group">
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-red-500 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <AlertTriangle className="absolute -bottom-2 -right-2 w-32 h-32 text-white opacity-5" />
            
            <h2 className="text-2xl font-black text-white mb-2 relative z-10 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" /> Emergency SOS
            </h2>
            <p className="text-red-100 text-sm mb-6 relative z-10 font-medium">Instantly share location & alert admin.</p>
            
            <div className="space-y-3 relative z-10">
              <button onClick={() => navigate('/dashboard/nanny/sos')} className="w-full bg-white text-red-700 font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" /> TRIGGER SOS
              </button>
              <button onClick={() => navigate('/dashboard/nanny/sos')} className="w-full bg-red-900/40 hover:bg-red-900/60 text-white border border-red-500/30 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                Silent SOS
              </button>
            </div>
          </div>

          {/* AI Matching Snippet */}
          <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-3xl p-8 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-xl">
                <HeartHandshake className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="font-bold text-lg">AI Child Match</h3>
            </div>
            <p className="text-indigo-100 text-sm mb-6">We found a family looking for your exact skills in Dhanmondi.</p>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-pink-400">94%</div>
                <div className="text-xs text-indigo-200 font-bold uppercase tracking-wider">Match Score</div>
              </div>
              <button onClick={() => navigate('/dashboard/nanny/apply')} className="bg-white text-indigo-900 font-bold px-4 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-colors">
                View Job
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
