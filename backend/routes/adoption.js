const express = require('express')
const router = express.Router()

const {
  getChildren,
  getChildById,
  getOrphanages,
  getOrphanageById,
  getApplications
} = require('../controllers/adoptionController')

router.get('/children', getChildren)
router.get('/children/:id', getChildById)
router.get('/orphanages', getOrphanages)
router.get('/orphanages/:id', getOrphanageById)
router.get('/applications', getApplications)

router.post('/apply', (req, res) => {
  res.json({ success: true, message: 'Adoption application submitted successfully' })
})

router.post('/meetup/confirm', (req, res) => {
  res.json({ success: true, message: 'Meetup attendance confirmed' })
})

module.exports = router
