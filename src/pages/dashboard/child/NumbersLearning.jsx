import React, { useState } from 'react'

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']

export default function NumbersLearning({ speak, playClick }) {
  const [currentNum, setCurrentNum] = useState(0)

  const handleNumberClick = (num) => {
    playClick()
    setCurrentNum(num)
    speak(num.toString())
  }

  const getWord = (n) => {
    if (n <= 10) return NUMBER_WORDS[n]
    if (n === 21) return 'Twenty-One'
    if (n === 51) return 'Fifty-One'
    return n.toString()
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-4xl mx-auto text-center mt-12">
      <h2 className="text-3xl font-bold text-cyan-600 mb-2">Learn Numbers 🔢</h2>
      <p className="text-slate-500 mb-8">Click the numbers to hear them!</p>

      <div className="flex flex-col items-center justify-center min-h-[300px] mb-12">
        <button 
          onClick={() => { playClick(); speak(currentNum.toString()) }}
          className="group flex flex-col items-center cursor-pointer hover:scale-105 transition"
        >
          <span className="text-[12rem] leading-none font-black text-cyan-500 drop-shadow-sm group-hover:text-cyan-400">
            {currentNum}
          </span>
          <span className="text-3xl font-bold text-slate-700 mt-4">
            {getWord(currentNum)}
          </span>
        </button>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-left">Quick Practice</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {[0,1,2,3,4,5,6,7,8,9,10,21,51].map(n => (
            <button
              key={n}
              onClick={() => handleNumberClick(n)}
              className={`p-3 rounded-xl font-bold text-lg transition ${
                currentNum === n 
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-cyan-300 hover:text-cyan-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
