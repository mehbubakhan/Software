const express = require('express')
const router = express.Router()

router.post('/apply', (req, res) => {
  // Mock saving adoption application to database
  res.json({ success: true, message: 'Adoption application submitted successfully' })
})

router.post('/meetup/confirm', (req, res) => {
  // Mock confirming a meetup
  res.json({ success: true, message: 'Meetup attendance confirmed' })
})

module.exports = router
