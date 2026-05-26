import React, { useState } from 'react'

const ALPHABET = [
  { letter: 'A', word: 'Apple', icon: '🍎' },
  { letter: 'B', word: 'Bear', icon: '🐻' },
  { letter: 'C', word: 'Cat', icon: '🐱' },
  { letter: 'D', word: 'Dog', icon: '🐶' },
  { letter: 'E', word: 'Elephant', icon: '🐘' },
  { letter: 'F', word: 'Frog', icon: '🐸' },
]

export default function AlphabetLearning({ speak, playClick, addCoins }) {
  const [index, setIndex] = useState(0)
  const current = ALPHABET[index]

  const handleNext = () => {
    playClick()
    if (index < ALPHABET.length - 1) {
      setIndex(index + 1)
    } else {
      addCoins(10) // reward for finishing
      alert("Great job! You finished the alphabet and earned 10 coins!")
      setIndex(0)
    }
  }

  const handlePrev = () => {
    playClick()
    if (index > 0) setIndex(index - 1)
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-4xl mx-auto text-center mt-12">
      <h2 className="text-3xl font-bold text-fuchsia-600 mb-2">Learn Alphabet 🔤</h2>
      <p className="text-slate-500 mb-8">Click the letters to hear them!</p>

      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="flex items-center gap-12 mb-8">
          <button 
            onClick={() => { playClick(); speak(current.letter) }}
            className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600 hover:scale-110 transition cursor-pointer"
          >
            {current.letter}
          </button>
          <button 
            onClick={() => { playClick(); speak(current.letter.toLowerCase()) }}
            className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 hover:scale-110 transition cursor-pointer"
          >
            {current.letter.toLowerCase()}
          </button>
        </div>

        <button 
          onClick={() => { playClick(); speak(`${current.letter} for ${current.word}`) }}
          className="flex items-center gap-4 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 hover:bg-slate-100 transition cursor-pointer"
        >
          <span className="text-4xl">{current.letter}</span>
          <span className="text-2xl text-slate-400">for</span>
          <span className="text-4xl font-bold text-slate-800">{current.word}</span>
          <span className="text-6xl ml-4">{current.icon}</span>
        </button>
      </div>

      <div className="flex justify-between items-center mt-12 border-t pt-8">
        <button 
          onClick={handlePrev}
          disabled={index === 0}
          className="px-6 py-2 rounded-full border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-slate-400 font-medium">Letter {index + 1} of {ALPHABET.length}</span>
        <button 
          onClick={handleNext}
          className="px-8 py-2 rounded-full bg-fuchsia-600 text-white font-bold hover:bg-fuchsia-700"
        >
          {index === ALPHABET.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}
