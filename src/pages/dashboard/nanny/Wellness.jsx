import React, { useState } from 'react';
import { 
  Heart, 
  BrainCircuit, 
  Coffee, 
  Activity, 
  Frown, 
  Smile, 
  Meh, 
  Headphones,
  PhoneCall,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export default function Wellness() {
  const [stressLevel, setStressLevel] = useState(50);
  const [loggedMood, setLoggedMood] = useState(null);
  const [counselingRequested, setCounselingRequested] = useState(false);

  const handleMoodLog = (mood) => {
    setLoggedMood(mood);
    alert(`Mood (${mood}) logged successfully. Thank you for checking in!`);
  };

  const requestCounseling = () => {
    setCounselingRequested(true);
    alert('A professional counselor will reach out to you within 24 hours. Your mental health is important to us.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          Mental Wellness <Heart className="w-8 h-8 text-pink-500 fill-pink-100" />
        </h1>
        <p className="text-slate-500 mt-2">Support for your mental health and well-being. Because caring for others starts with caring for yourself.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Check-ins & Burnout AI) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Burnout Detection AI (UNIQUE IDEA) */}
          <div className={`rounded-2xl border p-6 shadow-sm transition-colors ${stressLevel > 75 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-900">
              <BrainCircuit className={`w-5 h-5 ${stressLevel > 75 ? 'text-orange-500' : 'text-blue-500'}`} /> 
              AI Burnout Detection
            </h2>
            
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-700">Current Stress Level</span>
                <span className={`text-xl font-black ${stressLevel > 75 ? 'text-orange-600' : 'text-emerald-600'}`}>
                  {stressLevel}%
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={stressLevel} 
                onChange={(e) => setStressLevel(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
                <span>Relaxed</span>
                <span>Moderate</span>
                <span>Overwhelmed</span>
              </div>
            </div>

            {stressLevel > 75 ? (
              <div className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm flex gap-3 animate-pulse">
                <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-orange-900 text-sm">High Stress Detected</h3>
                  <p className="text-orange-800 text-xs mt-1">Our AI noticed you've been logging long hours and high stress. We strongly suggest taking a 15-minute break or scheduling a day off.</p>
                  <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors">
                    Request Time Off
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-emerald-800 text-sm font-medium">Your stress levels seem manageable. Keep up the great work and remember to stay hydrated!</p>
              </div>
            )}
          </div>

          {/* Daily Mood Tracking */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Daily Mood Tracker</h2>
            <p className="text-slate-500 text-sm mb-6">How are you feeling overall today?</p>
            
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => handleMoodLog('Great')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${loggedMood === 'Great' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200'}`}>
                <Smile className="w-10 h-10 mb-2 text-emerald-500" />
                <span className="text-sm font-bold text-slate-700">Great</span>
              </button>
              <button onClick={() => handleMoodLog('Okay')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${loggedMood === 'Okay' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200'}`}>
                <Meh className="w-10 h-10 mb-2 text-blue-500" />
                <span className="text-sm font-bold text-slate-700">Okay</span>
              </button>
              <button onClick={() => handleMoodLog('Struggling')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${loggedMood === 'Struggling' ? 'border-pink-500 bg-pink-50' : 'border-slate-100 hover:border-pink-200'}`}>
                <Frown className="w-10 h-10 mb-2 text-pink-500" />
                <span className="text-sm font-bold text-slate-700">Struggling</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (Support & Tips) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Professional Counseling */}
          <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Headphones className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-2">Need someone to talk to?</h2>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                As a SafeNanny premium member, you have access to free, confidential counseling sessions with certified therapists.
              </p>
              
              <button 
                onClick={requestCounseling}
                disabled={counselingRequested}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${counselingRequested ? 'bg-blue-800 text-blue-300 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-blue-50'}`}
              >
                <PhoneCall className="w-5 h-5" /> 
                {counselingRequested ? 'Counselor will call you soon' : 'Request Counseling Call'}
              </button>
            </div>
          </div>

          {/* Wellness Tips */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Coffee className="w-5 h-5 text-amber-600" /> Daily Wellness Tips
            </h2>
            
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-amber-900 mb-1">The 5-4-3-2-1 Grounding Technique</h3>
                <p className="text-xs text-amber-800">When feeling overwhelmed by a crying toddler, pause and find 5 things you can see, 4 you can touch, 3 you can hear...</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-blue-900 mb-1">Hydration Reminder</h3>
                <p className="text-xs text-blue-800">You've logged 4 hours of active work today. Make sure you've drank at least 3 glasses of water.</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-purple-900 mb-1">Stretching Break</h3>
                <p className="text-xs text-purple-800">Carrying a child strains your back. Try these 3 simple stretches to relieve tension.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
