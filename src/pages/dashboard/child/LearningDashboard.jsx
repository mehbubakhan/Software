import React from 'react'
import { Link } from 'react-router-dom'

export default function LearningDashboard({ coins, playClick }) {
  const categories = [
    { name: 'Learning', icon: '📚', color: 'bg-blue-500', path: '/dashboard/child/alphabet' },
    { name: 'Games', icon: '🎮', color: 'bg-green-500', path: '/dashboard/child/games' },
    { name: 'Videos', icon: '📺', color: 'bg-purple-500', path: '/dashboard/child/videos' },
    { name: 'Learn Together', icon: '🤝', color: 'bg-pink-500', path: '/dashboard/child/learn-together' },
    { name: 'Rewards Shop', icon: '🎁', color: 'bg-amber-400', path: '/dashboard/child/rewards' },
    { name: 'Advanced Learning', icon: '🔬', color: 'bg-slate-700', path: '/dashboard/child/advanced' },
  ]

  return (
    <div className="space-y-12">
      <section className="text-center mt-8">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">Let's Learn & Play! 🚀</h1>
        <p className="text-xl text-slate-500">Choose what you want to do today</p>
      </section>

      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>📈</span> Your child learning progress
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-fuchsia-50 border border-fuchsia-100">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-fuchsia-800">Letters</span>
              <span className="text-fuchsia-500">40%</span>
            </div>
            <div className="h-2 w-full bg-fuchsia-200 rounded-full overflow-hidden">
              <div className="h-full bg-fuchsia-500 w-[40%] rounded-full"></div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-cyan-50 border border-cyan-100">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-cyan-800">Numbers</span>
              <span className="text-cyan-500">75%</span>
            </div>
            <div className="h-2 w-full bg-cyan-200 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 w-[75%] rounded-full"></div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-amber-800">Shapes</span>
              <span className="text-amber-500">90%</span>
            </div>
            <div className="h-2 w-full bg-amber-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[90%] rounded-full"></div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-green-50 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-green-800">Reading</span>
              <span className="text-green-500">20%</span>
            </div>
            <div className="h-2 w-full bg-green-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[20%] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {categories.map(cat => (
          <Link
            key={cat.name}
            to={cat.path}
            onClick={playClick}
            className={`${cat.color} group relative overflow-hidden rounded-3xl p-8 transition hover:-translate-y-2 hover:shadow-xl text-white flex flex-col items-center justify-center min-h-[200px] text-center`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition duration-500 text-8xl">
              {cat.icon}
            </div>
            <span className="text-6xl mb-4 relative z-10 drop-shadow-md">{cat.icon}</span>
            <h3 className="text-2xl font-black relative z-10 drop-shadow-md">{cat.name}</h3>
          </Link>
        ))}
      </section>
    </div>
  )
}
