const pool = require('../config/db')

const createAlert = async ({ user_id, type, location, message }) => {
  const [res] = await pool.query('INSERT INTO emergency_alerts (user_id, type, location, message) VALUES (?, ?, ?, ?)', [user_id, type, location, message])
  return { id: res.insertId }
}

const findAllActive = async () => {
  const [rows] = await pool.query(`
    SELECT e.*, u.name as user_name 
    FROM emergency_alerts e
    LEFT JOIN users u ON e.user_id = u.id
    WHERE e.status = 'Active'
    ORDER BY e.created_at DESC
  `)
  return rows
}

const updateStatus = async (id, status) => {
  await pool.query('UPDATE emergency_alerts SET status = ? WHERE id = ?', [status, id])
}

module.exports = { createAlert, findAllActive, updateStatus }
