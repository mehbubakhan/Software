export const getLocalStorageItem = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch (err) {
    console.error('Failed to parse localStorage item', key, err)
    return defaultValue
  }
}

export const setLocalStorageItem = (key, value) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error('Failed to write localStorage item', key, err)
  }
}

export const getChildTestStats = () => {
  return getLocalStorageItem('child_test_stats', {
    taken: 0,
    passed: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestScore: 0,
    bestTopic: 'Word Building',
  })
}

export const recordQuizResult = (subject, score, total) => {
  const existing = getChildTestStats()
  const passed = score / total >= 0.6
  const newTaken = existing.taken + 1
  const newPassed = existing.passed + (passed ? 1 : 0)
  const newTotalCorrect = existing.totalCorrect + score
  const newTotalQuestions = existing.totalQuestions + total
  const newBestScore = Math.max(existing.bestScore, Math.round((score / total) * 100))
  const bestTopic = score / total >= 0.8 ? subject || existing.bestTopic : existing.bestTopic

  const updated = {
    taken: newTaken,
    passed: newPassed,
    totalCorrect: newTotalCorrect,
    totalQuestions: newTotalQuestions,
    bestScore: newBestScore,
    bestTopic,
  }
  setLocalStorageItem('child_test_stats', updated)
  recordActivityCompletion('quiz')
}

export const getChildGameStats = () => {
  return getLocalStorageItem('child_game_stats', {
    sessions: 0,
    wins: 0,
    totalPoints: 0,
    bestGame: 'Memory Match',
  })
}

export const recordGameSession = ({ gameId, won, points = 0 }) => {
  const existing = getChildGameStats()
  const sessions = existing.sessions + 1
  const wins = existing.wins + (won ? 1 : 0)
  const totalPoints = existing.totalPoints + points
  const bestGame = won ? (gameId || existing.bestGame) : existing.bestGame
  const updated = { sessions, wins, totalPoints, bestGame }
  setLocalStorageItem('child_game_stats', updated)
  recordActivityCompletion('game')
}

export const getChildActivityStats = () => {
  return getLocalStorageItem('child_activity_stats', {
    completed: 0,
    total: 10,
    log: [],
  })
}

export const recordActivityCompletion = (activityType) => {
  const existing = getChildActivityStats()
  const completed = Math.min(existing.total, existing.completed + 1)
  const log = [...existing.log, { type: activityType, timestamp: Date.now() }]
  const updated = { ...existing, completed, log }
  setLocalStorageItem('child_activity_stats', updated)
}
