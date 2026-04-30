const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { postJob, applyForJob, listApplications, decideApplication } = require('../controllers/jobController')

router.post('/post', auth, permit('admin'), postJob)
router.post('/apply', auth, permit('nanny'), applyForJob)
router.get('/:job_id/applications', auth, permit('admin'), listApplications)
router.post('/applications/:id/decide', auth, permit('admin'), decideApplication)

module.exports = router
