import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../services/api'
import { getChildTestStats, getChildGameStats, getChildActivityStats } from './progressUtils'

export default function ProgressDashboard({ playClick }) {
  const [learningProgress, setLearningProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [testStats, setTestStats] = useState(getChildTestStats())
  const [gameStats, setGameStats] = useState(getChildGameStats())
  const [activityStats, setActivityStats] = useState(getChildActivityStats())

  useEffect(() => {
    api.get('/child/progress')
      .then((res) => {
        if (Array.isArray(res.data)) {
          const progressMap = {}
          res.data.forEach((item) => {
            progressMap[item.module] = item.current_level
          })
          setLearningProgress(progressMap)
        }
      })
      .catch((err) => {
        console.error('Failed to load child progress:', err)
        setError('Unable to load learning progress. Showing a snapshot of recent activity.')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setTestStats(getChildTestStats())
    setGameStats(getChildGameStats())
    setActivityStats(getChildActivityStats())
  }, [loading])

  const moduleDefinitions = [
    { label: 'English', key: 'english', maxLevel: 5 },
    { label: 'Math', key: 'math', maxLevel: 5 },
    { label: 'Bangla', key: 'bangla', maxLevel: 5 },
    { label: 'Shapes', key: 'shape', maxLevel: 5 },
  ]

  const learningStats = moduleDefinitions.map((module) => {
    const level = learningProgress[module.key] || 1
    const percent = Math.min(100, Math.round((level / module.maxLevel) * 100))
    return { ...module, level, percent }
  })

  const learningAverage = Math.round(
    learningStats.reduce((sum, module) => sum + module.percent, 0) / learningStats.length
  )

  const testAverage = testStats.totalQuestions
    ? Math.round((testStats.totalCorrect / testStats.totalQuestions) * 100)
    : 0
  const testTaken = testStats.taken
  const testPassed = testStats.passed
  const bestTestTopic = testStats.bestTopic || 'Word Building'

  const gameSessions = gameStats.sessions
  const gameWins = gameStats.wins
  const gameMastery = gameSessions ? Math.min(100, Math.round((gameWins / gameSessions) * 100) + 20) : 20
  const favoriteGame = gameStats.bestGame || 'Memory Match'
  const coinsEarned = gameStats.totalPoints || 0

  const completedActivities = activityStats.completed ?? 0
  const totalActivities = activityStats.total ?? 10
  const activityCompletion = Math.min(100, Math.round((completedActivities / totalActivities) * 100))
  const recentActivities = activityStats.recent ?? activityStats.log ?? []

  const overallProgress = Math.round(
    (learningAverage + testAverage + gameMastery + activityCompletion) / 4
  )

  return (
    <div className="space-y-10 animate-in fade-in duration-400">
      <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-600">Child Progress</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">Track learning, tests, games and daily activities</h1>
          <p className="mt-2 max-w-2xl text-slate-500">This dashboard combines the child’s learning modules, quiz performance, game-based mastery, and activity completion into one progress report.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm w-full md:w-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Overall Progress</p>
          <p className="mt-3 text-5xl font-black text-fuchsia-600">{overallProgress}%</p>
          <div className="mt-4 w-72 rounded-full bg-slate-100 h-4 overflow-hidden">
            <div className="h-full bg-fuchsia-500" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Learning</h2>
                  <p className="mt-2 text-sm text-slate-500">Active module completion across English, Math, Bangla, and Shapes.</p>
                </div>
                <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800">{learningAverage}%</span>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500" style={{ width: `${learningAverage}%` }} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Tests</h2>
                  <p className="mt-2 text-sm text-slate-500">Average score across quizzes and most recent results.</p>
                </div>
                <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800">{testAverage}%</span>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${testAverage}%` }} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Games</h2>
                  <p className="mt-2 text-sm text-slate-500">Game sessions, wins, and earned coins reflected here.</p>
                </div>
                <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800">{gameMastery}%</span>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-lime-500" style={{ width: `${gameMastery}%` }} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Activities</h2>
                  <p className="mt-2 text-sm text-slate-500">Daily progress tasks and engagement tracked over time.</p>
                </div>
                <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800">{activityCompletion}%</span>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${activityCompletion}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Learning module progress</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Core skill levels</h2>
              </div>
              <Link
                to="/dashboard/child/learn"
                onClick={playClick}
                className="inline-flex items-center justify-center rounded-full bg-fuchsia-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-fuchsia-500"
              >
                Continue Learning
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {learningStats.map((module) => (
                <div key={module.key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>{module.label}</span>
                    <span>Level {module.level} / {module.maxLevel}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500" style={{ width: `${module.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Quiz progress</p>
              <h3 className="mt-3 text-3xl font-black text-blue-600">{testAverage}%</h3>
              <p className="mt-2 text-sm text-slate-500">{testPassed} of {testTaken} quizzes passed.</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${testAverage}%` }} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Game mastery</p>
              <h3 className="mt-3 text-3xl font-black text-emerald-600">{gameMastery}%</h3>
              <p className="mt-2 text-sm text-slate-500">{gameSessions} game sessions recorded.</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-500" style={{ width: `${gameMastery}%` }} />
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Daily activities</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900">{activityStats.completed}/{activityStats.total} Completed</h2>
            <p className="mt-2 text-sm text-slate-500">Productive learning and play assignments for today.</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${activityCompletion}%` }} />
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {recentActivities.length ? (
                recentActivities.map((item, index) => (
                  <li key={`${item.type || item}-${index}`} className="flex items-center gap-3">
                    <span className="text-fuchsia-500">•</span>
                    {item.type ? `${item.type} completed` : item}
                  </li>
                ))
              ) : (
                <li className="text-slate-500">No activity history available yet.</li>
              )}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Badges unlocked</p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-fuchsia-50 p-4">
                <p className="text-sm font-semibold text-fuchsia-700">Star Reader</p>
                <p className="mt-2 text-sm text-slate-600">Completed 5 reading challenges.</p>
              </div>
              <div className="rounded-3xl bg-cyan-50 p-4">
                <p className="text-sm font-semibold text-cyan-700">Quick Thinker</p>
                <p className="mt-2 text-sm text-slate-600">Finished 3 memory games with high accuracy.</p>
              </div>
              <div className="rounded-3xl bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-700">Activity Champ</p>
                <p className="mt-2 text-sm text-slate-600">Daily tasks completed for 4 consecutive days.</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
