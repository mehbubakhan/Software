const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { 
  saveProfile, getProfile, saveAvailability, getAvail, 
  getAgencies, getIndividualNannies, getFeaturedNannies, 
  getNannyDetails, getPayments,
  postNannyJob, getNannyJobs, startNannyShift, endNannyShift,
  safetyCheckin, triggerSos, getWellnessTools, requestNannyJob
} = require('../controllers/nannyController')

router.post('/profile', auth, permit('nanny'), saveProfile)
router.get('/profile', auth, permit('nanny'), getProfile)
router.post('/availability', auth, permit('nanny'), saveAvailability)
router.get('/availability', auth, permit('nanny'), getAvail)
router.get('/payments', auth, permit('nanny'), getPayments)

// New Nanny Features
router.post('/jobs', auth, permit('nanny'), postNannyJob)
router.get('/jobs', auth, permit('nanny'), getNannyJobs)
router.post('/shifts/start', auth, permit('nanny'), startNannyShift)
router.post('/shifts/end', auth, permit('nanny'), endNannyShift)
router.post('/safety/checkin', auth, permit('nanny'), safetyCheckin)
router.post('/sos/trigger', auth, permit('nanny'), triggerSos)
router.get('/wellness', auth, permit('nanny'), getWellnessTools)

// Public routes for finding nannies
router.get('/agencies', auth, getAgencies)
router.get('/individuals', auth, getIndividualNannies)
router.get('/featured', auth, getFeaturedNannies)
router.get('/:id', auth, getNannyDetails)

// Parent requesting a nanny job
router.post('/:id/request', auth, permit('parent'), requestNannyJob)

module.exports = router
