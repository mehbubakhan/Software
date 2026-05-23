import React, { useState, useEffect } from 'react'

export default function BasicMath({ playClick, addCoins, onBack, speak }) {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operation, setOperation] = useState('+')
  const [options, setOptions] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    generateProblem()
  }, [])

  const generateProblem = () => {
    const isAddition = Math.random() > 0.5
    let n1 = Math.floor(Math.random() * 10) + 1
    let n2 = Math.floor(Math.random() * 10) + 1

    // Ensure no negative numbers for subtraction
    if (!isAddition && n1 < n2) {
      const temp = n1
      n1 = n2
      n2 = temp
    }

    const op = isAddition ? '+' : '-'
    const ans = isAddition ? n1 + n2 : n1 - n2

    setNum1(n1)
    setNum2(n2)
    setOperation(op)
    setCorrectAnswer(ans)
    setMessage('')

    // Generate options
    let opts = new Set([ans])
    while (opts.size < 3) {
      // Add random offset between -3 and +3
      let offset = Math.floor(Math.random() * 7) - 3
      if (offset === 0) offset = 1
      let fakeAns = ans + offset
      if (fakeAns >= 0) opts.add(fakeAns)
    }

    // Shuffle options
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5))
  }

  const handleGuess = (guess) => {
    playClick()
    if (guess === correctAnswer) {
      addCoins(5)
      setScore(s => s + 1)
      setMessage('Correct! 🎉 +5 Coins')
      if (speak) speak('Correct! Great job!')
      setTimeout(() => {
        generateProblem()
      }, 1500)
    } else {
      setMessage('Oops, try again! 🤔')
      if (speak) speak('Oops, try again!')
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center relative max-w-2xl mx-auto">
      <button 
        onClick={() => { playClick(); onBack(); }}
        className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2 transition"
      >
        <span>←</span> Back to Topics
      </button>

      <div className="mb-8 mt-12">
        <h2 className="text-3xl font-bold text-blue-500 mb-2">Basic Math ➗</h2>
        <p className="text-slate-500">Solve the problems to earn coins! Score: {score}</p>
      </div>

      <div className="bg-blue-50 rounded-3xl p-8 mb-8 border border-blue-100 shadow-inner">
        <div className="text-6xl font-black text-slate-700 tracking-widest flex justify-center gap-4">
          <span>{num1}</span>
          <span className="text-blue-500">{operation}</span>
          <span>{num2}</span>
          <span className="text-blue-500">=</span>
          <span>?</span>
        </div>
      </div>

      {message && (
        <div className={`text-xl font-bold mb-6 animate-bounce ${message.includes('Correct') ? 'text-green-500' : 'text-orange-500'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleGuess(opt)}
            className="py-4 text-3xl font-bold text-white bg-blue-500 rounded-2xl hover:bg-blue-600 hover:-translate-y-1 transition shadow-md border-b-4 border-blue-700 active:border-b-0 active:translate-y-1"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
