const express = require('express')
const router = express.Router()

router.get('/progress', (req, res) => {
  // Mock returning learning progress data
  res.json({ progress: 45, completedLessons: 12 })
})

module.exports = router
