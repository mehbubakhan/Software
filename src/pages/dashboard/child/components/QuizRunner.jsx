import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Helper to shuffle an array
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5)

// Helper to convert English numbers to Bangla string
const toBanglaNum = (n) => {
  const d = ['০','১','২','৩','৪','৫','৬','৭','৮','৯']
  return n.toString().split('').map(c => d[parseInt(c, 10)]).join('')
}

export default function QuizRunner({ 
  items, 
  title, 
  playClick, 
  speak,
  addCoins,
  subject,
  isHardMode = false
}) {
  const navigate = useNavigate()
  const TOTAL_QUESTIONS = Math.min(15, items.length)

  const [running, setRunning] = useState(false)
  const [over, setOver] = useState(false)
  const [score, setScore] = useState(0)
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState(null)
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(60)
  const timerRef = useRef(null)

  // The selected random sequence of items
  const questionSequence = useMemo(() => {
    return shuffleArray(items).slice(0, TOTAL_QUESTIONS)
  }, [items, TOTAL_QUESTIONS])

  const [options, setOptions] = useState([])
  const currentItem = questionSequence[idx]

  // Setup current options
  const loadCurrent = useCallback(() => {
    setFeedback(null)
    setAnswered(false)
    
    if (!currentItem) return

    // Pick 3 random distractors OF THE SAME TYPE
    let pool = items.filter(item => item.id !== currentItem.id)
    if (currentItem.itemType) {
      pool = pool.filter(item => item.itemType === currentItem.itemType)
    }
    const distractors = shuffleArray(pool).slice(0, 3)
    
    // Combine and shuffle
    const mixed = shuffleArray([currentItem, ...distractors])
    setOptions(mixed)
  }, [currentItem, items])

  // Play audio for current question
  const playCurrentAudio = useCallback(() => {
    if (!currentItem) return
    
    if (currentItem.audioPath) {
      const audio = new Audio(currentItem.audioPath)
      audio.play().catch(e => console.error('Audio play failed:', e))
    } else if (speak && currentItem.speechText) {
      // Fallback to text-to-speech
      speak(currentItem.speechText)
    }
  }, [currentItem, speak])

  // Timer logic
  useEffect(() => {
    if (running && !over && isHardMode) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [running, over, isHardMode])

  const handleTimeOut = () => {
    setOver(true)
    setRunning(false)
    clearInterval(timerRef.current)
  }

  // Start exam
  const handleStart = () => {
    playClick && playClick()
    setRunning(true)
    setOver(false)
    setScore(0)
    setIdx(0)
    setTimeLeft(60)
    loadCurrent()
    setTimeout(playCurrentAudio, 300)
  }

  // Go to next
  const handleNext = () => {
    playClick && playClick()
    if (!answered) return
    const nextIdx = idx + 1
    if (nextIdx >= TOTAL_QUESTIONS) {
      setOver(true)
      setRunning(false)
      clearInterval(timerRef.current)
      
      // Track completion
      if (addCoins) {
        addCoins(score * 5)
      }
      return
    }
    setIdx(nextIdx)
  }

  // Trigger load when index changes
  useEffect(() => {
    if (running && !over && idx > 0) {
      loadCurrent()
      setTimeout(playCurrentAudio, 300)
    }
  }, [idx, loadCurrent, running, over])

  const handleOptionClick = (opt) => {
    if (!running || over || answered) return
    
    const isCorrect = opt.id === currentItem.id
    setAnswered(true)
    
    if (isCorrect) {
      setScore(s => s + 1)
      setFeedback({ ok: true, text: 'Correct! 😄' })
      playClick && playClick()
    } else {
      setFeedback({ ok: false, text: 'Sorry, wrong answer. 🙁' })
      playClick && playClick()
    }
  }

  const handleReplay = () => {
    playClick && playClick()
    playCurrentAudio()
  }

  // Formatting strings
  const isBangla = subject === 'bangla' || (subject === 'math' && title.includes('সংখ্যা'))
  const qStr = isBangla ? `প্রশ্ন ${toBanglaNum(idx + 1)}/${toBanglaNum(TOTAL_QUESTIONS)}` : `Q ${idx + 1}/${TOTAL_QUESTIONS}`
  const sStr = isBangla ? `নম্বর: ${toBanglaNum(score)}` : `Score: ${score}`

  const getResultFeedback = () => {
    const pct = score / TOTAL_QUESTIONS
    if (pct >= 0.85) return isBangla ? "চমৎকার! 🏆" : "Excellent! 🏆"
    if (pct >= 0.60) return isBangla ? "ভালো কাজ! 👍" : "Great job! 👍"
    if (pct >= 0.35) return isBangla ? "চেষ্টা ভালো হয়েছে 💪" : "Good try! 💪"
    return isBangla ? "চর্চা চালিয়ে যান 🌟" : "Keep practicing! 🌟"
  }

  // Build the specific prompt
  const getPromptText = () => {
    if (!currentItem) return ''
    const t = currentItem.itemType
    if (t === 'letter') return isBangla ? `সঠিক বর্ণ নির্বাচন করুন (____)` : `Select the alphabet (____)`
    if (t === 'word') return isBangla ? `সঠিক শব্দ নির্বাচন করুন (____)` : `Select the word (____)`
    if (t === 'number') return isBangla ? `সঠিক সংখ্যা নির্বাচন করুন (____)` : `Select the number (____)`
    if (t === 'shape') return `Select the shape (____)`
    if (t === 'color') return `Select the color (____)`
    return isBangla ? `সঠিক উত্তরটি নির্বাচন করুন (____)` : `Select the correct option (____)`
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-xl border-4 border-fuchsia-100 overflow-hidden">
      {/* Header */}
      <div className="bg-[#1e5871] text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-black drop-shadow-md">{title}</h2>
        <div className="flex items-center gap-4">
          {isHardMode && (
            <div className={`px-4 py-2 rounded-full font-bold text-lg shadow-inner ${timeLeft <= 10 ? 'bg-red-500 animate-pulse' : 'bg-slate-800'}`}>
              ⏳ {formatTime(timeLeft)}
            </div>
          )}
          <div className="bg-slate-800 px-6 py-2 rounded-full font-bold text-lg flex gap-4 shadow-inner">
            <span>{running || over ? qStr : (isBangla ? `মোট প্রশ্ন: ${toBanglaNum(TOTAL_QUESTIONS)}` : `Total: ${TOTAL_QUESTIONS}`)}</span>
            <span className="opacity-50">|</span>
            <span className="text-yellow-400">{running || over ? sStr : (isBangla ? 'নম্বর: ০' : 'Score: 0')}</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-10 bg-slate-50 min-h-[400px]">
        {!running && !over && (
          <div className="text-center py-12">
            <p className="text-xl font-bold text-slate-600 mb-8">
              {isBangla ? "👂 'শুরু করুন' চাপুন, শুনুন এবং সঠিক নির্বাচন করুন।" : "👂 Press Start, listen, and select the correct option."}
            </p>
            <button 
              onClick={handleStart}
              className="px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-2xl font-black rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              ▶ {isBangla ? 'শুরু করুন' : 'Start'}
            </button>
          </div>
        )}

        {running && !over && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center items-center gap-6 mb-2">
              <button 
                onClick={handleReplay}
                className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl shadow hover:bg-blue-200 transition"
                title="Play Audio Again"
              >
                🔊
              </button>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
                {getPromptText()}
              </h3>
            </div>
            
            <div className="h-10 flex items-center justify-center">
              {feedback && (
                <div className={`text-xl font-black px-6 py-1.5 rounded-full animate-bounce ${feedback.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {feedback.text}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {options.map((opt, i) => {
                let btnStyle = "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                if (answered) {
                  if (opt.id === currentItem.id) {
                    btnStyle = "bg-[#18632b] text-white border-green-800 shadow-inner"
                  } else if (!feedback.ok && opt.id !== currentItem.id) { // Highlight wrong answer
                    btnStyle = "bg-[#8f1f1f] text-white border-red-800 shadow-inner"
                  } else {
                    btnStyle = "bg-slate-100 text-slate-400 opacity-50"
                  }
                }

                const isLong = opt.display.length > 5
                return (
                  <button
                    key={i}
                    disabled={answered}
                    onClick={() => handleOptionClick(opt)}
                    className={`h-28 md:h-32 rounded-2xl border-2 font-black transition-all ${btnStyle} ${isLong ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'} flex items-center justify-center p-4 text-center`}
                  >
                    {opt.display}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
              <button 
                onClick={() => navigate(-1)}
                className="px-6 py-2 font-bold text-slate-500 hover:bg-slate-200 rounded-full transition"
              >
                {isBangla ? 'ফিরে যান' : 'Back'}
              </button>
              
              <button 
                onClick={handleNext}
                disabled={!answered}
                className={`px-8 py-2 text-lg font-black rounded-full shadow transition ${answered ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
              >
                {isBangla ? 'পরবর্তী ➔' : 'Next ➔'}
              </button>
            </div>
          </div>
        )}

        {over && (
          <div className="text-center py-12 space-y-6">
            <h3 className="text-4xl font-black text-slate-800">{isBangla ? 'ফলাফল' : 'Result'}</h3>
            <div className="text-6xl my-8">{getResultFeedback().split(' ')[1]}</div>
            <p className="text-2xl font-bold text-slate-600">
              {isBangla ? `আপনি ${toBanglaNum(TOTAL_QUESTIONS)} এর মধ্যে ${toBanglaNum(score)} পেয়েছেন` : `You scored ${score} out of ${TOTAL_QUESTIONS}`}
              {timeLeft <= 0 && <span className="text-red-500 ml-2">{isBangla ? '(সময় শেষ)' : '(Time out)'}</span>}
            </p>
            <p className="text-3xl font-black text-[#1e5871] pb-8">{getResultFeedback()}</p>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="px-8 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-full transition"
              >
                {isBangla ? 'ফিরে যান' : 'Back to Menu'}
              </button>
              <button 
                onClick={handleStart}
                className="px-8 py-3 bg-[#5bc2f2] hover:bg-cyan-500 text-[#1e5871] font-black rounded-full shadow-lg transition"
              >
                {isBangla ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
