const pool = require('../config/db')

const createJob = async ({ title, admin_id, vacancies, description }) => {
  const [res] = await pool.query('INSERT INTO jobs (title, admin_id, vacancies, description, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())', [title, admin_id, vacancies, description, 'open'])
  return { id: res.insertId }
}

const closeJob = async (id) => {
  await pool.query('UPDATE jobs SET status = ? WHERE id = ?', ['closed', id])
}

const findOpen = async () => {
  const [rows] = await pool.query('SELECT * FROM jobs WHERE status = "open"')
  return rows
}

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id])
  return rows[0]
}

module.exports = { createJob, closeJob, findOpen, findById }
