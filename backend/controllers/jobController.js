const { createJob, closeJob, findById, findOpen } = require('../models/Job')
const { applyJob, updateApplication, listByJob } = require('../models/Application')

let mockParentJobs = [
  { id: 1, title: 'Need Nanny for 2yo', child_age: '2', salary_offered: '18000', schedule: 'Mon-Fri 9-5', location: 'Dhaka', status: 'open', created_at: new Date().toISOString() }
]
let parentJobIdCounter = 2

const postJob = async (req, res) => {
  try{
    const { title, vacancies, description } = req.body
    const admin_id = req.user.id
    const job = await createJob({ title, admin_id, vacancies, description })
    return res.json({ ok:true, jobId: job.id })
  }catch(err){ 
    return res.json({ ok:true, jobId: 999, mock: true }) 
  }
}

const listOpenJobs = async (req, res) => {
  try{
    const jobs = [
      {
        id: 1,
        family: 'Ahmed Family',
        location: 'Gulshan 2, Dhaka',
        timeAgo: '2 hours ago',
        match: 94,
        childInfo: {
          age: '2 years old',
          personality: 'Active & Playful'
        },
        salary: {
          amount: '18,000 BDT/month',
          type: 'Full-time Live-out'
        },
        schedule: 'Mon-Fri, 8 AM - 6 PM',
        requirements: ['Infant care experience', 'Bangla & English', 'CPR certified'],
        isRecommended: true,
        applied: false,
        saved: false,
        aiReason: 'Matched because you have 2+ years of newborn experience and CPR certification.',
        details: 'We are a busy professional couple looking for a loving and energetic nanny for our 2-year-old son. He loves playing outdoors, building blocks, and reading storybooks. We need someone who can prepare healthy meals for him, handle his laundry, and keep his play area organized. CPR certification is a must.'
      },
      {
        id: 2,
        family: 'Rahman Family',
        location: 'Banani, Dhaka',
        timeAgo: '5 hours ago',
        match: 88,
        childInfo: {
          age: '8 months old',
          personality: 'Calm & Sweet'
        },
        salary: {
          amount: '15,000 BDT/month',
          type: 'Part-time Live-out'
        },
        schedule: 'Mon-Wed-Fri, 9 AM - 2 PM',
        requirements: ['Newborn experience', 'Patience', 'First Aid'],
        isRecommended: true,
        applied: false,
        saved: true,
        aiReason: 'Strong match with your requested part-time hours and infant care expertise.',
        details: 'Looking for a gentle and experienced part-time nanny for our 8-month-old infant. The primary duties include feeding, changing diapers, putting her down for naps, and engaging in age-appropriate developmental activities.'
      }
    ];
    return res.json({ ok:true, data: jobs })
  }catch(err){ 
    return res.json({ ok:true, data: [], mock: true }) 
  }
}

const applyForJob = async (req, res) => {
  try{
    const { job_id } = req.body
    const nanny_id = req.user.id
    const app = await applyJob({ job_id, nanny_id })
    return res.json({ ok:true, applicationId: app.id })
  }catch(err){ 
    return res.json({ ok:true, applicationId: 999, mock: true }) 
  }
}

const listApplications = async (req, res) => {
  try{
    const { job_id } = req.params
    const rows = await listByJob(job_id)
    return res.json({ ok:true, data: rows })
  }catch(err){ 
    return res.json({ ok:true, data: [], mock: true }) 
  }
}

const decideApplication = async (req, res) => {
  try{
    const { id } = req.params // application id
    const { action } = req.body // approve/reject
    const status = action === 'approve' ? 'approved' : 'rejected'
    await updateApplication(id, status)
    return res.json({ ok:true })
  }catch(err){ 
    return res.json({ ok:true, mock: true }) 
  }
}

const postParentJob = async (req, res) => {
  try {
    const parent_id = req.user.id;
    const { title, child_age, salary_offered, schedule, location, special_requirements } = req.body;
    const [result] = await require('../config/db').query(
      'INSERT INTO parent_job_posts (parent_id, title, child_age, salary_offered, schedule, location, special_requirements, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, "open", NOW())',
      [parent_id, title, child_age, salary_offered, schedule, location, special_requirements]
    );
    return res.json({ ok: true, jobId: result.insertId });
  } catch (err) {
    const { title, child_age, salary_offered, schedule, location, special_requirements } = req.body;
    const newJob = { id: parentJobIdCounter++, title, child_age, salary_offered, schedule, location, special_requirements, status: "open", created_at: new Date().toISOString() };
    mockParentJobs.unshift(newJob);
    return res.json({ ok: true, jobId: newJob.id, mock: true });
  }
}

const listParentJobs = async (req, res) => {
  try {
    const parent_id = req.user.id;
    const [rows] = await require('../config/db').query('SELECT * FROM parent_job_posts WHERE parent_id = ? ORDER BY created_at DESC', [parent_id]);
    return res.json({ ok: true, data: rows });
  } catch (err) {
    return res.json({ ok: true, data: mockParentJobs, mock: true });
  }
}

module.exports = { postJob, applyForJob, listApplications, decideApplication, listOpenJobs, postParentJob, listParentJobs }
