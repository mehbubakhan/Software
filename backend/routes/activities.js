const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { add, byChild } = require('../controllers/activityController')

router.post('/', auth, permit('nanny'), add)
router.get('/child/:child_id', auth, permit('parent','admin','nanny'), byChild)

module.exports = router
