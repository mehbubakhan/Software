const pool = require('../config/db')

const createUser = async ({ name, email, passwordHash, role }) => {
  const [res] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, passwordHash, role])
  return { id: res.insertId, name, email, role }
}

const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
  return rows[0]
}

const findById = async (id) => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [id])
  return rows[0]
}

module.exports = { createUser, findByEmail, findById }
