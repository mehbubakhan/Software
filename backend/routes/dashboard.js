const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { parentSummary, adminSummary, nannySummary, getParentOverview, getChildProfile, nannyOverview } = require('../controllers/dashboardController')

router.get('/parent', auth, permit('parent'), parentSummary)
router.get('/parent/overview', auth, permit('parent'), getParentOverview)
router.get('/parent/child/:id', auth, permit('parent'), getChildProfile)
router.get('/admin', auth, permit('admin'), adminSummary)
router.get('/admin/stats', auth, permit('admin'), adminSummary)
router.get('/nanny', auth, permit('nanny'), nannySummary)
router.get('/nanny/overview', auth, permit('nanny'), nannyOverview)

module.exports = router
