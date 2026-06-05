import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Routes, Route, Link } from 'react-router-dom'
import api from '../../services/api'
import ChildModeLearn from './child/ChildModeLearn'
import EnglishFormatMenu from './child/EnglishFormatMenu'
import MathFormatMenu from './child/MathFormatMenu'
import BanglaFormatMenu from './child/BanglaFormatMenu'
import TracingWrapper from './child/components/TracingWrapper'
import EnglishRhymePlayer from './child/components/EnglishRhymePlayer'
import ChildOverview from './child/ChildOverview'
import AlphabetLearning from './child/AlphabetLearning'
import NumbersLearning from './child/NumbersLearning'
import ShapesLearning from './child/ShapesLearning'
import GamesHub from './child/GamesHub'
import MemoryGame from './child/games/MemoryGame'
import TicTacToe from './child/games/TicTacToe'
import PuzzleGame from './child/games/PuzzleGame'
import WordSearch from './child/games/WordSearch'
import VideoLibrary from './child/VideoLibrary'
import LearnTogether from './child/LearnTogether'
import RewardsShop from './child/RewardsShop'
import DrawingCanvas from './child/DrawingCanvas'
import AdvancedLearning from './child/AdvancedLearning'
import ChildAuth from '../../components/ChildAuth'
import TestsHub from './child/TestsHub'
import TestFormatMenu from './child/TestFormatMenu'
import Quiz from './child/Quiz'

export default function ChildDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('child_coins')
    return saved ? parseInt(saved, 10) : 50
  })
  const [showExitAuth, setShowExitAuth] = useState(false)

  // Basic sound effect for clicks
  const playClick = useCallback(() => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3')
      audio.volume = 0.5
      audio.play().catch(e => console.log('Audio play blocked:', e))
    } catch (e) {
      console.log('Audio not supported')
    }
  }, [])

  // Text-to-speech utility
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel() // clear queue
      const msg = new SpeechSynthesisUtterance(text)
      msg.rate = 0.8 // slightly slower for kids
      msg.pitch = 1.2 // slightly higher pitch
      window.speechSynthesis.speak(msg)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('child_coins', coins.toString())
  }, [coins])

  const addCoins = (amount) => {
    setCoins(prev => prev + amount)
    playClick()
    api.post('/learning/track', {
      activity: 'Learning Module Completion',
      duration: 5,
      coins_earned: amount
    }).catch(e => console.error('Failed to track activity', e))
  }

  const handleExit = () => {
    setShowExitAuth(true)
  }

  // Provide context-like props down to routes
  const props = { coins, setCoins, addCoins, playClick, speak }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-100 via-pink-100 to-white flex flex-col font-sans">
      {/* Universal Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={handleExit}
            className="rounded-full bg-red-100 px-4 py-2 font-bold text-red-600 transition hover:bg-red-200"
          >
            Exit to Parent
          </button>

          {location.pathname !== '/dashboard/child' && location.pathname !== '/dashboard/child/' && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-bold text-slate-700 transition hover:bg-slate-200"
            >
              ⬅️ Back
            </button>
          )}

          <Link to="/dashboard/child" className="flex items-center gap-2 rounded-full hover:bg-slate-50 px-3 py-1 transition ml-2">
            <span className="text-xl font-black tracking-tight text-fuchsia-600">MiniMate</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 font-bold text-amber-700">
            <span>⭐</span> {coins} Coins
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-fuchsia-200 bg-fuchsia-100 flex items-center justify-center">
            <span className="text-xl">👧</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <Routes>
          <Route index element={<ChildOverview {...props} />} />
          <Route path="overview" element={<ChildOverview {...props} />} />
            <Route path="learn" element={<ChildModeLearn playClick={playClick} />} />
            
            {/* English Routes */}
            <Route path="learn/english" element={<EnglishFormatMenu playClick={playClick} />} />
            <Route path="learn/english/uppercase" element={<TracingWrapper moduleType="english_uppercase" playClick={playClick} />} />
            <Route path="learn/english/lowercase" element={<TracingWrapper moduleType="english_lowercase" playClick={playClick} />} />
            <Route path="learn/english/word-making" element={<TracingWrapper moduleType="english_words" playClick={playClick} />} />
            <Route path="learn/english/rhyme" element={<EnglishRhymePlayer playClick={playClick} />} />
            
            {/* Math Routes */}
            <Route path="learn/math" element={<MathFormatMenu playClick={playClick} />} />
            <Route path="learn/math/bangla" element={<TracingWrapper moduleType="math_bangla" playClick={playClick} />} />
            <Route path="learn/math/english" element={<TracingWrapper moduleType="math_english" playClick={playClick} />} />
            <Route path="learn/math/bangla-spelling" element={<TracingWrapper moduleType="math_spelling_bangla" playClick={playClick} />} />
            <Route path="learn/math/english-spelling" element={<TracingWrapper moduleType="math_spelling_english" playClick={playClick} />} />

            {/* Bangla Routes */}
            <Route path="learn/bangla" element={<BanglaFormatMenu playClick={playClick} />} />
            <Route path="learn/bangla/shoroborno" element={<TracingWrapper moduleType="bangla_shoroborno" playClick={playClick} />} />
            <Route path="learn/bangla/benjonborno" element={<TracingWrapper moduleType="bangla_benjonborno" playClick={playClick} />} />
            <Route path="learn/bangla/shoroborno-words" element={<TracingWrapper moduleType="bangla_shoroborno_words" playClick={playClick} />} />
            <Route path="learn/bangla/benjonborno-words" element={<TracingWrapper moduleType="bangla_benjonborno_words" playClick={playClick} />} />

            {/* Shape Route (directly loads canvas) */}
            <Route path="learn/shapes" element={<TracingWrapper moduleType="shapes" playClick={playClick} />} />
          <Route path="games" element={<GamesHub {...props} />} />
          <Route path="tests" element={<TestsHub playClick={playClick} />} />
          <Route path="tests/:subject" element={<TestFormatMenu playClick={playClick} />} />
          <Route path="tests/play/:subject/:mode" element={<Quiz playClick={playClick} addCoins={addCoins} speak={speak} />} />
          <Route path="rewards" element={<RewardsShop {...props} />} />
          <Route path="draw" element={<DrawingCanvas {...props} />} />
          <Route path="collaboration" element={<LearnTogether {...props} />} />
          <Route path="progress" element={<div className="p-8 text-center"><h1 className="text-4xl font-black text-fuchsia-600">Progress Tracking Coming Soon!</h1></div>} />
          <Route path="settings" element={<div className="p-8 text-center"><h1 className="text-4xl font-black text-fuchsia-600">Child Settings Coming Soon!</h1></div>} />

          {/* Legacy sub-routes for games and learning */}
          <Route path="learn/alphabet" element={<AlphabetLearning {...props} />} />
          <Route path="learn/numbers" element={<NumbersLearning {...props} />} />
          <Route path="games/memory" element={<MemoryGame {...props} />} />
          <Route path="games/tictactoe" element={<TicTacToe {...props} />} />
          <Route path="games/puzzle" element={<PuzzleGame {...props} />} />
          <Route path="games/wordsearch" element={<WordSearch {...props} />} />
          <Route path="videos" element={<VideoLibrary {...props} />} />
          <Route path="advanced" element={<AdvancedLearning {...props} />} />
        </Routes>
      </main>

      {/* Exit Auth Modal */}
      <ChildAuth isOpen={showExitAuth} onClose={() => setShowExitAuth(false)} onSuccess={() => navigate('/dashboard/parent')} />
    </div>
  )
}
