import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  TrendingUp, 
  Clock, 
  Heart, 
  Brain, 
  Star, 
  Zap, 
  Target, 
  Check,
  Award,
  Mail,
  X,
  ChevronLeft
} from 'lucide-react';

export default function Reviews() {
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  return (
    <div className="space-y-8 pb-12 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            Reputation <span className="text-2xl">🏆</span>
          </h1>
          <p className="text-slate-500 mt-2">Build trust and showcase your skills</p>
        </div>
        <button 
          onClick={() => setIsRequestModalOpen(true)}
          className="bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-pink-700 transition-colors flex items-center gap-2 text-sm"
        >
          <Mail className="w-4 h-4" /> Request Review
        </button>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-2xl p-8 text-center text-white shadow-sm flex flex-col items-center">
        <div className="flex items-center gap-2 text-white/90 font-medium mb-3">
          <Shield className="w-6 h-6" /> <span className="text-lg">Verified Trusted Badge</span>
        </div>
        <div className="text-6xl font-black mb-2">4.8</div>
        <div className="flex items-center gap-1 mb-2 mt-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} className="w-7 h-7 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <div className="text-white/90 text-sm mt-3">Based on 23 parent reviews</div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-2">Trust Score</h3>
          <div className="text-3xl font-black text-slate-900 mb-2">4.9/5.0</div>
          <p className="text-xs text-slate-500">Verification & background checks</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-2">Safety Score</h3>
          <div className="text-3xl font-black text-slate-900 mb-2">4.8/5.0</div>
          <p className="text-xs text-slate-500">Work history & GPS tracking</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-2">Attendance Score</h3>
          <div className="text-3xl font-black text-slate-900 mb-2">4.7/5.0</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-2">Parent Rating</h3>
          <div className="text-3xl font-black text-slate-900 mb-2">4.8/5.0</div>
        </div>
      </div>

      {/* AI Compatibility Matching */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-pink-500 fill-pink-500" /> AI Compatibility Matching
          </h2>
          <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full w-max mt-2 md:mt-0">
            AI Powered
          </span>
        </div>
        <p className="text-sm text-slate-600 mb-6">Our AI analyzes your personality, skills, and work style to match you with compatible families.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#f9f5ff] rounded-xl p-8 text-center border border-fuchsia-50">
            <div className="text-4xl font-black text-[#a855f7] mb-2">92%</div>
            <div className="text-sm text-slate-600">Average Match Score</div>
          </div>
          <div className="bg-blue-50/50 rounded-xl p-8 text-center border border-blue-50">
            <div className="text-4xl font-black text-blue-600 mb-2">18</div>
            <div className="text-sm text-slate-600">Compatible Jobs</div>
          </div>
        </div>
      </div>

      {/* Skills & Certifications */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Skills & Certifications</h2>
        <div className="flex flex-wrap gap-3">
          {['CPR Certified', 'First Aid', 'Child Psychology', 'Special Needs Care', 'Infant Care Expert'].map(skill => (
            <span key={skill} className="bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
              <Check className="w-4 h-4" /> {skill}
            </span>
          ))}
          <span className="bg-[#0284c7] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
            <Check className="w-4 h-4" /> Bilingual (English/Bangla)
          </span>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
          Achievements <Award className="w-6 h-6 text-amber-500" />
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#fdf4ff] rounded-xl p-6 text-center flex flex-col items-center border border-[#fae8ff]">
            <Star className="w-10 h-10 text-yellow-400 fill-yellow-400 mb-4" />
            <h3 className="font-bold text-slate-900 text-[15px]">Top Rated</h3>
            <p className="text-xs text-slate-500 mt-1">100+ 5-star reviews</p>
          </div>
          <div className="bg-[#fdf4ff] rounded-xl p-6 text-center flex flex-col items-center border border-[#fae8ff]">
            <Zap className="w-10 h-10 text-orange-500 fill-orange-500 mb-4" />
            <h3 className="font-bold text-slate-900 text-[15px]">Quick Responder</h3>
            <p className="text-xs text-slate-500 mt-1">&lt;1hr reply time</p>
          </div>
          <div className="bg-[#fdf4ff] rounded-xl p-6 text-center flex flex-col items-center border border-[#fae8ff]">
            <Target className="w-10 h-10 text-red-500 mb-4" />
            <h3 className="font-bold text-slate-900 text-[15px]">100% Attendance</h3>
            <p className="text-xs text-slate-500 mt-1">Never missed a day</p>
          </div>
          <div className="bg-[#fdf4ff] rounded-xl p-6 text-center flex flex-col items-center border border-[#fae8ff]">
            <Heart className="w-10 h-10 text-red-500 fill-red-500 mb-4" />
            <h3 className="font-bold text-slate-900 text-[15px]">Parent Favorite</h3>
            <p className="text-xs text-slate-500 mt-1">95% rehire rate</p>
          </div>
        </div>
      </div>

      {/* Parent Reviews */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900">Parent Reviews</h2>
          <div className="flex items-center gap-2 text-slate-600 font-medium text-lg">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> 4.8 <span className="font-normal text-slate-500 ml-1">(23 reviews)</span>
          </div>
        </div>

        <div className="space-y-3 mb-10 w-full md:w-3/4">
          {[ 
            { stars: 5, count: 18, pct: '80%' }, 
            { stars: 4, count: 4, pct: '18%' }, 
            { stars: 3, count: 1, pct: '5%' } 
          ].map(row => (
            <div key={row.stars} className="flex items-center gap-4 text-sm text-slate-600">
              <span className="w-6">{row.stars}★</span>
              <div className="flex-1 bg-blue-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#1e88e5] h-full rounded-full" style={{ width: row.pct }}></div>
              </div>
              <span className="w-6 text-right text-slate-500">{row.count}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <img src="https://i.pravatar.cc/150?img=5" alt="Mrs. Johnson" className="w-12 h-12 rounded-full" />
                <h3 className="font-bold text-slate-900 text-[15px]">Mrs. Johnson</h3>
              </div>
              <span className="text-sm text-slate-400">May 20, 2026</span>
            </div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            </div>
            <p className="text-slate-600 text-[15px]">Excellent care! Sarah is amazing with our kids. Very professional and caring.</p>
          </div>

          <div className="border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <img src="https://i.pravatar.cc/150?img=11" alt="Mr. Ahmed" className="w-12 h-12 rounded-full" />
                <h3 className="font-bold text-slate-900 text-[15px]">Mr. Ahmed</h3>
              </div>
              <span className="text-sm text-slate-400">May 15, 2026</span>
            </div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            </div>
            <p className="text-slate-600 text-[15px]">Highly recommend! Our daughter loves her. Always on time and very responsible.</p>
          </div>

          <div className="border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <img src="https://i.pravatar.cc/150?img=9" alt="Mrs. Rahman" className="w-12 h-12 rounded-full" />
                <h3 className="font-bold text-slate-900 text-[15px]">Mrs. Rahman</h3>
              </div>
              <span className="text-sm text-slate-400">May 10, 2026</span>
            </div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
              <Star className="w-5 h-5 text-slate-200" />
            </div>
            <p className="text-slate-600 text-[15px]">Great experience overall. Very punctual and good with children.</p>
          </div>
        </div>
      </div>

      {/* Request Review Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <button onClick={() => setIsRequestModalOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Request a Review</h2>
              <p className="text-slate-500 mb-6 text-sm">Send a customized link to parents you've worked with previously.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Parent's Email</label>
                  <input 
                    type="email" 
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g. parent@example.com"
                  />
                </div>
                <button 
                  onClick={() => {
                    alert('Review request sent!');
                    setIsRequestModalOpen(false);
                  }}
                  className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition-colors mt-4"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
