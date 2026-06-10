const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { postJob, applyForJob, listApplications, decideApplication, postParentJob, listParentJobs, updateParentJob, deleteParentJob } = require('../controllers/jobController')

router.post('/post', auth, permit('admin'), postJob)
router.post('/apply', auth, permit('nanny'), applyForJob)
router.get('/open', auth, permit('nanny','parent','admin'), require('../controllers/jobController').listOpenJobs)
router.get('/:job_id/applications', auth, permit('admin'), listApplications)
router.post('/applications/:id/decide', auth, permit('admin'), decideApplication)

router.post('/parent/post', auth, permit('parent'), postParentJob)
router.get('/parent/my', auth, permit('parent'), listParentJobs)
router.put('/parent/post/:id', auth, permit('parent'), updateParentJob)
router.delete('/parent/post/:id', auth, permit('parent'), deleteParentJob)

module.exports = router
