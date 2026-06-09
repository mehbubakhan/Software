import React from 'react';
import { HeartHandshake, Sparkles, Brain, CheckCircle, Activity, Star } from 'lucide-react';

export default function Compatibility() {
  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-[#1e1b4b] to-[#4338ca] p-10 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <Sparkles className="absolute top-4 right-4 w-24 h-24 text-white opacity-5" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-black mb-3 flex items-center gap-3">
            <HeartHandshake className="w-10 h-10 text-pink-400" /> Child Compatibility Engine
          </h1>
          <p className="text-indigo-100 text-lg font-medium">
            Our AI analyzes your personality, communication style, and experience to match you emotionally and practically with the perfect childcare jobs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Your Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-500" /> Your Personality Profile
            </h2>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                  <span>Patience Level</span>
                  <span className="text-indigo-600">High</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[90%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                  <span>Energy Level</span>
                  <span className="text-emerald-600">Moderate</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[65%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                  <span>Communication Style</span>
                  <span className="text-blue-600">Gentle</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[80%] rounded-full"></div>
                </div>
              </div>
            </div>

            <button className="w-full mt-8 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-colors border border-slate-200 text-sm">
              Retake Personality Test
            </button>
          </div>
        </div>

        {/* Right Column: AI Matches */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Top Emotionally Compatible Jobs</h2>
          
          <div className="space-y-4">
            
            {/* Match 1 */}
            <div className="bg-white rounded-3xl border-2 border-pink-100 p-6 shadow-sm hover:shadow-md transition-all flex gap-6 items-center">
              <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-pink-100 to-rose-50 rounded-2xl flex flex-col items-center justify-center border border-pink-200">
                <span className="text-3xl font-black text-pink-600">98%</span>
                <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Match</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">Toddler Care - The Rahman Family</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Requires high patience and gentle communication.</p>
                <div className="flex gap-2 mt-3">
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> High Activity</span>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Star className="w-3.5 h-3.5" /> Perfect Skill Match</span>
                </div>
              </div>
              <div>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm">
                  Apply Now
                </button>
              </div>
            </div>

            {/* Match 2 */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex gap-6 items-center">
              <div className="w-24 h-24 shrink-0 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-200">
                <span className="text-3xl font-black text-slate-700">85%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Match</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">Newborn Care - The Smith Family</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Requires structured routine and calm environment.</p>
                <div className="flex gap-2 mt-3">
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Good Personality Match</span>
                </div>
              </div>
              <div>
                <button className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all">
                  View Details
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
