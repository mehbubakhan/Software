const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { sos, getAllSos, updateSos } = require('../controllers/sosController')

router.post('/', auth, permit('nanny'), sos)
router.get('/all', auth, permit('admin'), getAllSos)
router.patch('/:id', auth, permit('admin'), updateSos)

module.exports = router
