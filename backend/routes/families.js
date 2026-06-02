const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { getMyFamily, getProfile, updateProfile } = require('../controllers/familyController')

router.get('/my', auth, permit('parent', 'admin'), getMyFamily)
router.get('/my/profile', auth, permit('parent'), getProfile)
router.put('/my/profile', auth, permit('parent'), updateProfile)

module.exports = router
