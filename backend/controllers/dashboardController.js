const pool = require('../config/db')

const parentSummary = async (req, res) => {
  try{
    const parent_id = req.user.id
    const [children] = await pool.query('SELECT * FROM children WHERE parent_id = ?', [parent_id])
    return res.json({ ok:true, summary: { childrenCount: children.length, children } })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const adminSummary = async (req, res) => {
  try{
    const [admissions] = await pool.query('SELECT COUNT(*) as pending FROM admissions WHERE status="pending"')
    const [jobs] = await pool.query('SELECT COUNT(*) as openJobs FROM jobs WHERE status="open"')
    return res.json({ ok:true, summary: { pendingAdmissions: admissions[0].pending, openJobs: jobs[0].openJobs } })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const nannySummary = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const [assigned] = await pool.query('SELECT COUNT(*) as assigned FROM activities WHERE nanny_id = ?', [nanny_id])
    return res.json({ ok:true, summary: { assignedCount: assigned[0].assigned } })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

module.exports = { parentSummary, adminSummary, nannySummary }
