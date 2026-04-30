const pool = require('../config/db')

const addActivity = async ({ child_id, nanny_id, type, details }) => {
  const [res] = await pool.query('INSERT INTO activities (child_id, nanny_id, type, details, created_at) VALUES (?, ?, ?, ?, NOW())', [child_id, nanny_id, type, JSON.stringify(details)])
  return { id: res.insertId }
}

const listByChild = async (child_id) => {
  const [rows] = await pool.query('SELECT * FROM activities WHERE child_id = ? ORDER BY created_at DESC', [child_id])
  return rows.map(r => ({ ...r, details: JSON.parse(r.details) }))
}

module.exports = { addActivity, listByChild }
