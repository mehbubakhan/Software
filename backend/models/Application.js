const pool = require('../config/db')

const applyJob = async ({ job_id, nanny_id }) => {
  const [res] = await pool.query('INSERT INTO applications (job_id, nanny_id, status, created_at) VALUES (?, ?, ?, NOW())', [job_id, nanny_id, 'pending'])
  return { id: res.insertId }
}

const updateApplication = async (id, status) => {
  await pool.query('UPDATE applications SET status = ? WHERE id = ?', [status, id])
}

const listByJob = async (job_id) => {
  const [rows] = await pool.query('SELECT a.*, u.name as nanny_name FROM applications a JOIN users u ON a.nanny_id = u.id WHERE a.job_id = ?', [job_id])
  return rows
}

const listByNanny = async (nanny_id) => {
  const [rows] = await pool.query('SELECT a.*, j.title as job_title FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.nanny_id = ?', [nanny_id])
  return rows
}

module.exports = { applyJob, updateApplication, listByJob, listByNanny }
