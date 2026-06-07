import React, { useState } from 'react';
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
