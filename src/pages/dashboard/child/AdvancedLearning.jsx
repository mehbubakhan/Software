import React from 'react'

export default function AdvancedLearning({ playClick }) {
  const subjects = [
    { name: 'The Solar System', icon: '🌍', color: 'bg-indigo-500' },
    { name: 'Basic Math', icon: '➗', color: 'bg-blue-500' },
    { name: 'World Geography', icon: '🗺️', color: 'bg-emerald-500' },
    { name: 'Animals in Nature', icon: '🦁', color: 'bg-amber-500' },
    { name: 'Introduction to Science', icon: '🧪', color: 'bg-purple-500' },
    { name: 'History of Inventions', icon: '💡', color: 'bg-rose-500' },
  ]

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-5xl mx-auto text-center mt-12">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Advanced Learning 🔬</h2>
      <p className="text-slate-500 mb-2">Explore more complex topics! (Ages 6-10)</p>
      
      <div className="bg-indigo-50 rounded-2xl p-6 mt-8 mb-8 border border-indigo-100">
        <h3 className="font-bold text-indigo-800 text-xl mb-4">Choose a Topic 🧠</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {subjects.map(sub => (
            <button 
              key={sub.name}
              onClick={() => {
                playClick()
                alert(`Opening ${sub.name} lesson... (Coming Soon)`)
              }}
              className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-md transition text-left"
            >
              <div className={`${sub.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white shadow-inner`}>
                {sub.icon}
              </div>
              <span className="font-bold text-slate-700">{sub.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
