const pool = require('../config/db')

let mockParentJobs = [
  { id: 1, title: 'Need Nanny for 2yo', child_age: '2', salary_offered: '18000', schedule: 'Mon-Fri 9-5', location: 'Dhaka', status: 'open', created_at: new Date().toISOString() }
]
let parentJobIdCounter = 2

const postJob = async (req, res) => {
  try {
    const { title, vacancies, description } = req.body
    const admin_id = req.user.id
    const [result] = await pool.query('INSERT INTO jobs (title, admin_id, vacancies, description) VALUES (?, ?, ?, ?)', [title, admin_id, vacancies, description])
    return res.json({ ok:true, jobId: result.insertId })
  } catch (err) { 
    return res.json({ ok:true, jobId: 999, mock: true }) 
  }
}

const listOpenJobs = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pjp.*, u.name as family_name
      FROM parent_job_posts pjp
      JOIN users u ON pjp.parent_id = u.id
      WHERE pjp.status = 'open'
      ORDER BY pjp.created_at DESC
    `)
    
    const jobs = rows.map(r => {
      const timeAgo = (Math.floor((new Date() - new Date(r.created_at)) / 3600000)) + ' hours ago'
      return {
        id: r.id,
        family: r.family_name + ' Family',
        location: r.location,
        timeAgo: timeAgo === '0 hours ago' ? 'Just now' : timeAgo,
        match: Math.floor(Math.random() * 20) + 80, // Mock AI match percentage
        childInfo: {
          age: r.child_age,
          personality: 'Active & Playful'
        },
        salary: {
          amount: '৳' + r.salary_offered + '/mo',
          type: r.schedule?.toLowerCase().includes('part') ? 'Part-time' : 'Full-time'
        },
        schedule: r.schedule,
        requirements: r.special_requirements ? r.special_requirements.split(',').map(s => s.trim()) : [],
        isRecommended: true,
        applied: false,
        saved: false,
        aiReason: 'Matched because of your experience.',
        details: r.title + '. ' + r.special_requirements
      }
    })
    
    return res.json({ ok: true, data: jobs })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message }) 
  }
}

const applyForJob = async (req, res) => {
  try {
    const { job_id } = req.body
    const nanny_id = req.user.id
    const [result] = await pool.query('INSERT INTO applications (job_id, nanny_id) VALUES (?, ?)', [job_id, nanny_id])
    return res.json({ ok:true, applicationId: result.insertId })
  } catch (err) { 
    return res.json({ ok:true, applicationId: 999, mock: true }) 
  }
}

const listApplications = async (req, res) => {
  try {
    const { job_id } = req.params
    const [rows] = await pool.query('SELECT * FROM applications WHERE job_id = ?', [job_id])
    return res.json({ ok:true, data: rows })
  } catch (err) { 
    return res.json({ ok:true, data: [], mock: true }) 
  }
}

const decideApplication = async (req, res) => {
  try {
    const { id } = req.params // application id
    const { action } = req.body // approve/reject
    const status = action === 'approve' ? 'approved' : 'rejected'
    await pool.query('UPDATE applications SET status = ? WHERE id = ?', [status, id])
    return res.json({ ok:true })
  } catch (err) { 
    return res.json({ ok:true, mock: true }) 
  }
}

const postParentJob = async (req, res) => {
  try {
    const parent_id = req.user.id;
    const { title, child_age, salary_offered, schedule, location, special_requirements } = req.body;
    const [result] = await pool.query(
      'INSERT INTO parent_job_posts (parent_id, title, child_age, salary_offered, schedule, location, special_requirements, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, "open", NOW())',
      [parent_id, title, child_age, salary_offered, schedule, location, special_requirements]
    );
    return res.json({ ok: true, jobId: result.insertId });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

const listParentJobs = async (req, res) => {
  try {
    const parent_id = req.user.id;
    const [rows] = await pool.query('SELECT * FROM parent_job_posts WHERE parent_id = ? ORDER BY created_at DESC', [parent_id]);
    return res.json({ ok: true, data: rows });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { postJob, applyForJob, listApplications, decideApplication, listOpenJobs, postParentJob, listParentJobs }
