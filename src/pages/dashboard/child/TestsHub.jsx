import React from 'react'
import { Link } from 'react-router-dom'

export default function TestsHub({ playClick }) {
  const tests = [
    { id: 'bangla', name: 'Bangla Basic Test', icon: '🇧🇩', color: 'bg-emerald-500' },
    { id: 'english', name: 'English Basic Test', icon: '🔤', color: 'bg-blue-500' },
    { id: 'shape', name: 'Shape Test', icon: '🔺', color: 'bg-amber-500' },
    { id: 'memory', name: 'Memory Test', icon: '🧠', color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-12">
      <section className="text-center mt-8">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">Quiz Time! 📝</h1>
        <p className="text-xl text-slate-500">Test what you've learned and earn big rewards!</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {tests.map(test => (
          <Link
            key={test.id}
            to={`/dashboard/child/tests/${test.id}`}
            onClick={playClick}
            className={`${test.color} group relative overflow-hidden rounded-3xl p-8 transition hover:-translate-y-2 hover:shadow-xl text-white flex flex-col items-center justify-center min-h-[180px] text-center`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition duration-500 text-8xl">
              {test.icon}
            </div>
            <span className="text-5xl mb-4 relative z-10 drop-shadow-md">{test.icon}</span>
            <h3 className="text-2xl font-black relative z-10 drop-shadow-md">{test.name}</h3>
          </Link>
        ))}
      </section>
    </div>
  )
}
