const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { saveProfile, getProfile, saveAvailability, getAvail, uploadVerificationDoc, getVerificationStatus, getAgencies, getIndividualNannies, getFeaturedNannies, getNannyDetails } = require('../controllers/nannyController')

router.post('/profile', auth, permit('nanny'), saveProfile)
router.get('/profile', auth, permit('nanny'), getProfile)
router.post('/availability', auth, permit('nanny'), saveAvailability)
router.get('/availability', auth, permit('nanny'), getAvail)

router.post('/verify', auth, permit('nanny'), uploadVerificationDoc)
router.get('/verify', auth, permit('nanny'), getVerificationStatus)

router.get('/agencies', auth, getAgencies)
router.get('/individuals', auth, getIndividualNannies)
router.get('/featured', auth, getFeaturedNannies)
router.get('/:id', auth, getNannyDetails)

module.exports = router
