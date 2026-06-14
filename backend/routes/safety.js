const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { respond, triggerEmergencySos } = require('../controllers/safetyController')

router.post('/respond', auth, permit('nanny'), respond)
router.post('/emergency-sos', auth, triggerEmergencySos)

module.exports = router
