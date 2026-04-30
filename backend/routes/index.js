const express = require('express')
const router = express.Router()

router.use('/auth', require('./auth'))
router.use('/admissions', require('./admissions'))
router.use('/jobs', require('./jobs'))
router.use('/activities', require('./activities'))
router.use('/dashboard', require('./dashboard'))

module.exports = router
