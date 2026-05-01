const pool = require('../config/db')

const recordResponse = async ({ nanny_id, check_id, response, note }) => {
  const [res] = await pool.query('INSERT INTO safety_responses (check_id, nanny_id, response, note, created_at) VALUES (?, ?, ?, ?, NOW())', [check_id, nanny_id, response, note])
  return { id: res.insertId }
}

module.exports = { recordResponse }
