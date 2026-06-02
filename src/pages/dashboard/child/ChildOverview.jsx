import React from 'react';
import { Link } from 'react-router-dom';

export default function ChildOverview({ coins, playClick }) {
  const modules = [
    { label: 'Learn', icon: '📚', path: 'learn', color: 'from-pink-400 to-pink-600' },
    { label: 'Games', icon: '🎮', path: 'games', color: 'from-purple-400 to-purple-600' },
    { label: 'Tests', icon: '📝', path: 'tests', color: 'from-blue-400 to-blue-600' },
    { label: 'Draw', icon: '🎨', path: 'draw', color: 'from-fuchsia-400 to-fuchsia-600' },
    { label: 'Rewards', icon: '🎁', path: 'rewards', color: 'from-yellow-400 to-orange-500' },
    { label: 'Friends', icon: '🤝', path: 'collaboration', color: 'from-green-400 to-emerald-600' },
    { label: 'Progress', icon: '⭐', path: 'progress', color: 'from-indigo-400 to-indigo-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-md border-2 border-fuchsia-200 rounded-3xl p-4 flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(217,70,239,0.2)]">
          <div className="text-4xl bg-fuchsia-100 w-14 h-14 rounded-full flex items-center justify-center">👧</div>
          <div>
            <p className="text-sm font-bold text-fuchsia-800 uppercase tracking-wider">Player</p>
            <p className="text-xl font-black text-slate-800">Emma</p>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md border-2 border-amber-200 rounded-3xl p-4 flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(251,191,36,0.2)]">
          <div className="text-4xl animate-bounce">🪙</div>
          <div>
            <p className="text-sm font-bold text-amber-700 uppercase tracking-wider">Coins</p>
            <p className="text-2xl font-black text-slate-800">{coins}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border-2 border-blue-200 rounded-3xl p-4 flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(96,165,250,0.2)]">
          <div className="text-4xl">⭐</div>
          <div>
            <p className="text-sm font-bold text-blue-700 uppercase tracking-wider">Stars</p>
            <p className="text-2xl font-black text-slate-800">12</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border-2 border-green-200 rounded-3xl p-4 flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(74,222,128,0.2)]">
          <div className="text-4xl">🔥</div>
          <div>
            <p className="text-sm font-bold text-green-700 uppercase tracking-wider">Streak</p>
            <p className="text-2xl font-black text-slate-800">3 Days</p>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-3xl p-8 text-center text-white shadow-[0_8px_30px_rgba(217,70,239,0.4)] relative overflow-hidden group border-4 border-white/20 cursor-pointer hover:scale-[1.02] transition-transform" onClick={playClick}>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2 drop-shadow-md">Keep Going! 🚀</h2>
        <p className="text-xl md:text-2xl font-bold text-white/90 mb-6 drop-shadow">Next: English Alphabet - Letter C</p>
        <Link to="learn" className="inline-block bg-white text-fuchsia-600 px-10 py-4 rounded-full font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] hover:scale-105 transition-all">
          PLAY NOW
        </Link>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {modules.map((m, idx) => (
          <Link 
            key={idx} 
            to={m.path}
            onClick={playClick}
            className={`bg-gradient-to-br ${m.color} rounded-3xl p-6 text-center text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] border-4 border-white/20 hover:scale-105 hover:-translate-y-2 transition-all duration-300 group`}
          >
            <div className="text-6xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform drop-shadow-lg">{m.icon}</div>
            <h3 className="text-xl md:text-2xl font-black drop-shadow-md">{m.label}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
