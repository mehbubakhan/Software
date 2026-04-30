const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { parentSummary, adminSummary, nannySummary } = require('../controllers/dashboardController')

router.get('/parent', auth, permit('parent'), parentSummary)
router.get('/admin', auth, permit('admin'), adminSummary)
router.get('/nanny', auth, permit('nanny'), nannySummary)

module.exports = router
