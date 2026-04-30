const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { apply, approve, pending } = require('../controllers/admissionController')

router.post('/apply', auth, permit('parent'), apply)
router.get('/pending', auth, permit('admin'), pending)
router.post('/:id/decide', auth, permit('admin'), approve)

module.exports = router
