const { createJob, closeJob, findById } = require('../models/Job')
const { applyJob, updateApplication, listByJob } = require('../models/Application')

const postJob = async (req, res) => {
  try{
    const { title, vacancies, description } = req.body
    const admin_id = req.user.id
    const job = await createJob({ title, admin_id, vacancies, description })
    return res.json({ ok:true, jobId: job.id })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const listOpenJobs = async (req, res) => {
  try{
    const jobs = await findOpen()
    return res.json({ ok:true, data: jobs })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const applyForJob = async (req, res) => {
  try{
    const { job_id } = req.body
    const nanny_id = req.user.id
    const app = await applyJob({ job_id, nanny_id })
    return res.json({ ok:true, applicationId: app.id })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const listApplications = async (req, res) => {
  try{
    const { job_id } = req.params
    const rows = await listByJob(job_id)
    return res.json({ ok:true, data: rows })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const decideApplication = async (req, res) => {
  try{
    const { id } = req.params // application id
    const { action } = req.body // approve/reject
    const status = action === 'approve' ? 'approved' : 'rejected'
    await updateApplication(id, status)
    return res.json({ ok:true })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

module.exports = { postJob, applyForJob, listApplications, decideApplication }

