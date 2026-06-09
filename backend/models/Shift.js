const pool = require('../config/db')

const startShift = async ({ nanny_id, job_id }) => {
  const [res] = await pool.query('INSERT INTO nanny_shifts (nanny_id, job_id, check_in, status) VALUES (?, ?, NOW(), ?)', [nanny_id, job_id, 'active'])
  return { id: res.insertId, nanny_id, job_id, status: 'active' }
}

const endShift = async (shift_id, nanny_id) => {
  await pool.query('UPDATE nanny_shifts SET check_out = NOW(), status = "completed" WHERE id = ? AND nanny_id = ?', [shift_id, nanny_id])
  return { id: shift_id, status: 'completed' }
}

const breakShift = async (shift_id, nanny_id) => {
  await pool.query('UPDATE nanny_shifts SET status = "break" WHERE id = ? AND nanny_id = ?', [shift_id, nanny_id])
  return { id: shift_id, status: 'break' }
}

const resumeShift = async (shift_id, nanny_id) => {
  await pool.query('UPDATE nanny_shifts SET status = "active" WHERE id = ? AND nanny_id = ?', [shift_id, nanny_id])
  return { id: shift_id, status: 'active' }
}

const getActiveShift = async (nanny_id) => {
  const [rows] = await pool.query('SELECT * FROM nanny_shifts WHERE nanny_id = ? AND status IN ("active", "break") ORDER BY check_in DESC LIMIT 1', [nanny_id])
  return rows[0]
}

module.exports = { startShift, endShift, breakShift, resumeShift, getActiveShift }
