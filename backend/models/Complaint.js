const pool = require('../config/db')

const createComplaint = async ({ reporter_id, target_user_id, complaint_type, description, priority }) => {
  const [res] = await pool.query('INSERT INTO complaints (reporter_id, target_user_id, complaint_type, description, priority) VALUES (?, ?, ?, ?, ?)', [reporter_id, target_user_id, complaint_type, description, priority || 'Normal'])
  return { id: res.insertId }
}

const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT c.*, u.name as reporter_name, t.name as target_name 
    FROM complaints c
    LEFT JOIN users u ON c.reporter_id = u.id
    LEFT JOIN users t ON c.target_user_id = t.id
    ORDER BY c.created_at DESC
  `)
  return rows
}

const updateStatus = async (id, status) => {
  await pool.query('UPDATE complaints SET status = ? WHERE id = ?', [status, id])
}

module.exports = { createComplaint, findAll, updateStatus }
