const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { getPendingVerifications, updateVerificationStatus, getSystemStats, getAllUsers } = require('../controllers/adminController')

router.get('/verifications', auth, permit('admin'), getPendingVerifications)
router.patch('/verifications/:id', auth, permit('admin'), updateVerificationStatus)
router.get('/stats', auth, permit('admin'), getSystemStats)
router.get('/users', auth, permit('admin'), getAllUsers)

module.exports = router
