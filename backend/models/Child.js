const pool = require('../config/db')

const createChild = async ({ name, parent_id, dob }) => {
  const [res] = await pool.query('INSERT INTO children (name, parent_id, dob) VALUES (?, ?, ?)', [name, parent_id, dob])
  return { id: res.insertId, name }
}

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM children WHERE id = ?', [id])
  return rows[0]
}

const listByParent = async (parent_id) => {
  const [rows] = await pool.query('SELECT * FROM children WHERE parent_id = ?', [parent_id])
  return rows
}

module.exports = { createChild, findById, listByParent }
