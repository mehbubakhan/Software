import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function LearningLanding() {
  const navigate = useNavigate()

  const categories = [
    { 
      name: 'Learning', 
      desc: 'Learn ABCs, 123s & more!',
      icon: '📖', 
      color: 'bg-blue-400 hover:bg-blue-500', 
      path: '/dashboard/child/alphabet' 
    },
    { 
      name: 'Games', 
      desc: 'Play fun learning games',
      icon: '🎮', 
      color: 'bg-green-400 hover:bg-green-500', 
      path: '/dashboard/child/games' 
    },
    { 
      name: 'Videos', 
      desc: 'Watch educational videos',
      icon: '📺', 
      color: 'bg-purple-400 hover:bg-purple-500', 
      path: '/dashboard/child/videos' 
    },
    { 
      name: 'Learn Together', 
      desc: 'Learn with friends!',
      icon: '👥', 
      color: 'bg-pink-400 hover:bg-pink-500', 
      path: '/dashboard/child/learn-together' 
    },
    { 
      name: 'Rewards Shop', 
      desc: 'Redeem points for rewards',
      icon: '🎁', 
      color: 'bg-yellow-300 hover:bg-yellow-400 text-slate-800', 
      path: '/dashboard/child/rewards' 
    },
    { 
      name: 'Advanced Learning', 
      desc: 'Explore advanced topics',
      icon: '🎓', 
      color: 'bg-slate-300 hover:bg-slate-400 text-slate-800', 
      path: '/dashboard/child/advanced' 
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Main Content Container */}
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        
        {/* Gradient Card */}
        <div className="relative w-full max-w-4xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-[3rem] p-10 md:p-16 shadow-sm border border-white/50">
          
          {/* Parent Mode Button */}
          <button 
            onClick={() => navigate('/dashboard/parent')}
            className="absolute top-8 right-8 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-purple-700 transition shadow-sm"
          >
            <span>👤</span> Parent Mode
          </button>

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-blue-600 mb-4 flex items-center justify-center gap-4">
              Let's Learn & Play! <span className="text-5xl">🎉</span>
            </h1>
            <p className="text-slate-600 font-medium text-lg mb-6">Choose what you want to do today</p>
            
            <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100">
              <span className="text-xl">⭐</span>
              <span className="font-black text-slate-800 text-lg">69 Points</span>
            </div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={cat.path}
                className={`${cat.color} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-center text-center min-h-[140px] border border-white/20`}
              >
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl drop-shadow-sm">{cat.icon}</span>
                </div>
                <h3 className={`text-xl font-bold mb-1 ${cat.name === 'Rewards Shop' || cat.name === 'Advanced Learning' ? 'text-slate-800' : 'text-white'}`}>
                  {cat.name}
                </h3>
                <p className={`text-sm font-medium ${cat.name === 'Rewards Shop' || cat.name === 'Advanced Learning' ? 'text-slate-600' : 'text-white/90'}`}>
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>

        </div>
      </main>

      {/* Footer Section */}
      <footer className="w-full bg-gradient-to-r from-pink-200 via-orange-100 to-green-200 py-16 px-8 text-center mt-auto">
        <h2 className="text-2xl font-black text-slate-900 mb-12">Why choose MiniMate?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="mb-4 text-slate-800">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Safety First</h3>
            <p className="text-xs text-purple-800/70 font-medium px-4">All nannies undergo thorough background checks and verification processes.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-4 text-slate-800">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Experienced Professionals</h3>
            <p className="text-xs text-purple-800/70 font-medium px-4">Connect with qualified caregivers who have proven track records.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-4 text-slate-800">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Peace of Mind</h3>
            <p className="text-xs text-purple-800/70 font-medium px-4">24/7 support and satisfaction guarantee for your family's needs.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
