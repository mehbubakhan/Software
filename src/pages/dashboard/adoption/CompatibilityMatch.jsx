import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function CompatibilityMatch() {
  const matches = [
    {
      id: 1,
      matchScore: 94,
      traits: ['Calm Environment', 'Creative Focus', 'Pet Friendly'],
      status: 'High Compatibility',
      notes: 'Based on your psychological evaluation and home environment, this child shares a strong compatibility with your calm and creative lifestyle.'
    },
    {
      id: 2,
      matchScore: 82,
      traits: ['Active Lifestyle', 'Structured Routine', 'No Pets'],
      status: 'Moderate Compatibility',
      notes: 'Requires a highly structured routine which aligns with your schedule, but prefers a pet-free home (you have a dog).'
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-[#0B132B]">AI Compatibility Matches</h2>
        <p className="text-slate-500 mt-1">Ethical, AI-assisted suggestions based on parenting style, psychology, and child needs.</p>
      </div>

      <div className="bg-[#0B132B] rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-[#F4A261]" size={28} />
            <h3 className="text-2xl font-bold">Smart Match Engine Active</h3>
          </div>
          <p className="text-slate-300 max-w-xl">
            Our AI analyzes your psychological assessment, lifestyle, and home environment to find the safest and most emotionally compatible children for your family.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-purple-500/20 to-transparent blur-2xl pointer-events-none" />
      </div>

      <div className="space-y-6">
        {matches.map((match, idx) => (
          <motion.div 
            key={match.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center"
          >
            {/* Match Score Circle */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={match.matchScore > 90 ? "text-green-500" : "text-amber-500"} strokeDasharray={`${match.matchScore}, 100`} strokeWidth="3" stroke="currentColor" fill="none" strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-[#0B132B]">{match.matchScore}%</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Match</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-xl font-bold text-[#0B132B]">Child Profile #{match.id}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${match.matchScore > 90 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {match.status}
                </span>
              </div>
              
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                {match.notes}
              </p>

              <div className="flex flex-wrap gap-2">
                {match.traits.map(trait => (
                  <span key={trait} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-green-500" />
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0">
              <button className="w-full md:w-auto px-6 py-3 bg-[#0B132B] hover:bg-[#1a233a] text-white font-bold rounded-xl transition-colors">
                Request Meeting
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
