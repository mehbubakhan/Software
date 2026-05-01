const express = require('express')
const router = express.Router()

router.use('/auth', require('./auth'))
router.use('/admissions', require('./admissions'))
router.use('/jobs', require('./jobs'))
router.use('/activities', require('./activities'))
router.use('/dashboard', require('./dashboard'))
router.use('/children', require('./children'))
router.use('/applications', require('./applications'))
router.use('/nanny', require('./nanny'))
router.use('/safety', require('./safety'))
router.use('/sos', require('./sos'))

module.exports = router
