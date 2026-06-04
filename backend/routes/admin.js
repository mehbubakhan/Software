const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { getPendingVerifications, updateVerificationStatus } = require('../controllers/adminController')

router.get('/verifications', auth, permit('admin'), getPendingVerifications)
router.patch('/verifications/:id', auth, permit('admin'), updateVerificationStatus)

module.exports = router
