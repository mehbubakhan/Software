const pool = require('../config/db')

const sendSos = async ({ nanny_id, lat, lng, message }) => {
  const [res] = await pool.query('INSERT INTO sos_events (nanny_id, lat, lng, message, created_at) VALUES (?, ?, ?, ?, NOW())', [nanny_id, lat, lng, message])
  return { id: res.insertId }
}

module.exports = { sendSos }
