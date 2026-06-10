const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { getMyFamily, getProfile, updateProfile, addChild, editChild } = require('../controllers/familyController')

router.get('/my', auth, permit('parent', 'admin'), getMyFamily)
router.get('/my/profile', auth, permit('parent'), getProfile)
router.put('/my/profile', auth, permit('parent'), updateProfile)
router.post('/my/children', auth, permit('parent'), addChild)
router.put('/my/children/:id', auth, permit('parent'), editChild)

module.exports = router
