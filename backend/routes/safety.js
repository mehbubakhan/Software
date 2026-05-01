const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { respond } = require('../controllers/safetyController')

router.post('/respond', auth, permit('nanny'), respond)

module.exports = router
