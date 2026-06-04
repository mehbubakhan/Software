import React, { useState } from 'react'

const BANGLA_ALPHABET = [
  { letter: 'অ', word: 'অজগর', icon: '🐍' },
  { letter: 'আ', word: 'আম', icon: '🥭' },
  { letter: 'ই', word: 'ইঁদুর', icon: '🐭' },
  { letter: 'ঈ', word: 'ঈগল', icon: '🦅' },
  { letter: 'উ', word: 'উট', icon: '🐪' },
  { letter: 'ঊ', word: 'ঊষা', icon: '🌅' },
  { letter: 'ঋ', word: 'ঋষি', icon: '🧘‍♂️' },
  { letter: 'এ', word: 'একতারা', icon: '🎸' },
  { letter: 'ঐ', word: 'ঐরাবত', icon: '🐘' },
  { letter: 'ও', word: 'ওজন', icon: '⚖️' },
  { letter: 'ঔ', word: 'ঔষধ', icon: '💊' },
]

export default function BanglaLearning({ speak, playClick, addCoins }) {
  const [index, setIndex] = useState(0)
  const current = BANGLA_ALPHABET[index]

  const handleNext = () => {
    playClick()
    if (index < BANGLA_ALPHABET.length - 1) {
      setIndex(index + 1)
    } else {
      addCoins(10) // reward for finishing
      alert("Great job! You finished the Bangla vowels and earned 10 coins!")
      setIndex(0)
    }
  }

  const handlePrev = () => {
    playClick()
    if (index > 0) setIndex(index - 1)
  }

  // Uses English phonetic fallback for speak if Bangla TTS is not available on the device
  // A robust app would use a proper audio file for each letter
  const playSound = (text) => {
    playClick()
    // Speech synthesis for Bangla (might fallback to generic if not installed)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const msg = new SpeechSynthesisUtterance(text)
      msg.lang = 'bn-BD'
      msg.rate = 0.8
      msg.pitch = 1.2
      window.speechSynthesis.speak(msg)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-4xl mx-auto text-center mt-12">
      <h2 className="text-3xl font-bold text-green-600 mb-2">বাংলা স্বরবর্ণ 📖</h2>
      <p className="text-slate-500 mb-8">বর্ণে ক্লিক করে শব্দ শোনো!</p>

      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="flex items-center gap-12 mb-8">
          <button 
            onClick={() => playSound(current.letter)}
            className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 hover:scale-110 transition cursor-pointer"
          >
            {current.letter}
          </button>
        </div>

        <button 
          onClick={() => playSound(current.word)}
          className="flex items-center gap-4 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 hover:bg-slate-100 transition cursor-pointer"
        >
          <span className="text-4xl">{current.letter}</span>
          <span className="text-2xl text-slate-400">তে</span>
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
          আগেরটি
        </button>
        <span className="text-slate-400 font-medium font-sans">Letter {index + 1} of {BANGLA_ALPHABET.length}</span>
        <button 
          onClick={handleNext}
          className="px-8 py-2 rounded-full bg-green-600 text-white font-bold hover:bg-green-700"
        >
          {index === BANGLA_ALPHABET.length - 1 ? 'শেষ' : 'পরেরটি'}
        </button>
      </div>
    </div>
  )
}
