const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { sos } = require('../controllers/sosController')

router.post('/', auth, permit('nanny'), sos)

module.exports = router
