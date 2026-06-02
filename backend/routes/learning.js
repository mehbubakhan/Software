const express = require('express')
const router = express.Router()

router.get('/progress', (req, res) => {
  // Mock returning learning progress data
  res.json({ progress: 45, completedLessons: 12, coins: 50 })
})

router.post('/track', (req, res) => {
  // In a real app, this would save the child's learning activity to DB
  const { activity, duration, coins_earned } = req.body;
  console.log(`Child tracked activity: ${activity}, coins earned: ${coins_earned}`);
  res.json({ success: true, message: `Tracked ${activity}, earned ${coins_earned} coins` })
})

module.exports = router
