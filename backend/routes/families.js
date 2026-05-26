const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { getMyFamily } = require('../controllers/familyController')

router.get('/my', auth, permit('parent', 'admin'), getMyFamily)

module.exports = router
