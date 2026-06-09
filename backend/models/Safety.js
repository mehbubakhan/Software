const pool = require('../config/db')

const recordResponse = async ({ nanny_id, check_id, response, note }) => {
  const [res] = await pool.query('INSERT INTO safety_responses (check_id, nanny_id, response, note, created_at) VALUES (?, ?, ?, ?, NOW())', [check_id, nanny_id, response, note])
  return { id: res.insertId }
}

const logSafetyCheckin = async ({ nanny_id, status, location }) => {
  const [res] = await pool.query('INSERT INTO nanny_safety_logs (nanny_id, type, location, status, created_at) VALUES (?, ?, ?, ?, NOW())', [nanny_id, 'checkin', location, status])
  return { id: res.insertId, status }
}

module.exports = { recordResponse, logSafetyCheckin }
