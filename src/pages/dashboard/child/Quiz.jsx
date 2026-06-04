import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../../services/api'

const QUIZZES = {
  bangla: {
    title: 'Bangla Basic Test',
    questions: [
      { q: 'প্রথম স্বরবর্ণ কোনটি?', options: ['আ', 'অ', 'ই', 'উ'], answer: 'অ' },
      { q: '"আম" শব্দের প্রথম বর্ণ কী?', options: ['অ', 'ই', 'আ', 'এ'], answer: 'আ' }
    ]
  },
  english: {
    title: 'English Basic Test',
    questions: [
      { q: 'Which letter comes after A?', options: ['C', 'B', 'D', 'E'], answer: 'B' },
      { q: 'A is for...', options: ['Apple', 'Banana', 'Cat', 'Dog'], answer: 'Apple' }
    ]
  },
  shape: {
    title: 'Shape Test',
    questions: [
      { q: 'Which shape has 3 sides?', options: ['Square', 'Circle', 'Triangle', 'Rectangle'], answer: 'Triangle' },
      { q: 'Which shape is perfectly round?', options: ['Triangle', 'Square', 'Circle', 'Star'], answer: 'Circle' }
    ]
  },
  memory: {
    title: 'Memory Test',
    questions: [
      { q: 'What color is the sky on a clear day?', options: ['Red', 'Green', 'Blue', 'Yellow'], answer: 'Blue' },
      { q: 'How many legs does a dog have?', options: ['2', '4', '6', '8'], answer: '4' }
    ]
  }
}

export default function Quiz({ playClick, addCoins, speak }) {
  const { testId } = useParams()
  const navigate = useNavigate()
  
  const quiz = QUIZZES[testId]
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [animating, setAnimating] = useState(null)

  if (!quiz) return <div className="p-8 text-center text-xl">Quiz not found!</div>

  const currentQ = quiz.questions[currentQIndex]

  const handleAnswer = (option) => {
    playClick()
    const isCorrect = option === currentQ.answer
    setAnimating(isCorrect ? 'correct' : 'wrong')

    if (isCorrect) {
      speak('Correct! Great job!')
      setScore(score + 1)
    } else {
      speak('Oops, try again next time!')
    }

    setTimeout(() => {
      setAnimating(null)
      if (currentQIndex < quiz.questions.length - 1) {
        setCurrentQIndex(currentQIndex + 1)
      } else {
        finishQuiz(score + (isCorrect ? 1 : 0))
      }
    }, 1500)
  }

  const finishQuiz = async (finalScore) => {
    setShowResult(true)
    const percentage = (finalScore / quiz.questions.length) * 100
    const earnedCoins = finalScore * 5

    if (earnedCoins > 0) {
      addCoins(earnedCoins)
    }

    speak(`You finished! You scored ${finalScore} out of ${quiz.questions.length}`)

    try {
      await api.post('/child/test/submit', {
        childId: 1,
        module: testId,
        lesson: 'basic',
        score: percentage,
        stars: finalScore >= quiz.questions.length ? 3 : (finalScore > 0 ? 1 : 0)
      })
    } catch (e) {
      console.error('Failed to save score')
    }
  }

  if (showResult) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-2xl mx-auto text-center mt-12 animate-in zoom-in duration-500">
        <h2 className="text-4xl font-black text-slate-800 mb-4">Quiz Finished! 🎉</h2>
        <p className="text-2xl text-slate-600 mb-8">You scored {score} out of {quiz.questions.length}</p>
        <div className="text-6xl mb-8">
          {score === quiz.questions.length ? '🌟🌟🌟' : score > 0 ? '🌟' : '💪'}
        </div>
        <p className="text-lg text-amber-600 font-bold mb-8">+ {score * 5} Coins Earned!</p>
        <button 
          onClick={() => { playClick(); navigate('/dashboard/child/tests') }}
          className="px-8 py-3 bg-fuchsia-600 text-white rounded-full font-bold text-xl hover:bg-fuchsia-700 transition"
        >
          Back to Tests
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-3xl mx-auto mt-12 relative overflow-hidden">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">{quiz.title}</h2>
        <span className="text-fuchsia-600 font-bold bg-fuchsia-50 px-4 py-1 rounded-full">
          Question {currentQIndex + 1} of {quiz.questions.length}
        </span>
      </div>

      <div className="mb-12">
        <h3 className="text-3xl font-bold text-center text-slate-800 mb-8 leading-tight">
          {currentQ.q}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => !animating && handleAnswer(opt)}
              disabled={animating !== null}
              className={`p-6 text-2xl font-bold rounded-2xl transition border-4 
                ${animating && opt === currentQ.answer 
                  ? 'bg-green-100 border-green-500 text-green-700 scale-105' 
                  : animating 
                    ? 'bg-slate-50 border-slate-100 text-slate-400 opacity-50' 
                    : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-fuchsia-300 hover:bg-fuchsia-50 hover:-translate-y-1'
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Overlay */}
      {animating && (
        <div className={`absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10 animate-in fade-in`}>
          <div className={`text-9xl transform ${animating === 'correct' ? 'animate-bounce' : 'animate-pulse'}`}>
            {animating === 'correct' ? '✅' : '❌'}
          </div>
        </div>
      )}
    </div>
  )
}
