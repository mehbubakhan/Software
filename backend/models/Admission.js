const pool = require('../config/db')

const applyAdmission = async ({ child_id, parent_id, daycare_id }) => {
  const [res] = await pool.query('INSERT INTO admissions (child_id, parent_id, daycare_id, status, created_at) VALUES (?, ?, ?, ?, NOW())', [child_id, parent_id, daycare_id, 'pending'])
  return { id: res.insertId }
}

const updateStatus = async (id, status) => {
  await pool.query('UPDATE admissions SET status = ? WHERE id = ?', [status, id])
}

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM admissions WHERE id = ?', [id])
  return rows[0]
}

const listPending = async (daycare_id) => {
  let query = 'SELECT a.*, c.name as child_name, u.name as parent_name FROM admissions a JOIN children c ON a.child_id = c.id JOIN users u ON a.parent_id = u.id WHERE a.status = "pending"';
  let params = [];
  if (daycare_id) {
    query += ' AND a.daycare_id = ?';
    params.push(daycare_id);
  }
  query += ' ORDER BY a.created_at DESC';
  const [rows] = await pool.query(query, params);
  return rows
}

module.exports = { applyAdmission, updateStatus, findById, listPending }
