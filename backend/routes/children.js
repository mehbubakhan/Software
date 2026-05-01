const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { assignedToNanny, detail, addTimetable } = require('../controllers/childController')

router.get('/assigned', auth, permit('nanny'), assignedToNanny)
router.get('/:id', auth, permit('parent','admin','nanny'), detail)
router.post('/:id/timetable', auth, permit('nanny'), addTimetable)

module.exports = router
