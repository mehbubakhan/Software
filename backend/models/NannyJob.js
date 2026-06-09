const pool = require('../config/db')

const createJob = async ({ nanny_id, title, description, availability_date }) => {
  const [res] = await pool.query('INSERT INTO nanny_jobs (nanny_id, title, description, availability_date) VALUES (?, ?, ?, ?)', [nanny_id, title, description, availability_date])
  return { id: res.insertId, nanny_id, title, description, availability_date, status: 'open' }
}

const findByNanny = async (nanny_id) => {
  const [rows] = await pool.query('SELECT * FROM nanny_jobs WHERE nanny_id = ?', [nanny_id])
  return rows
}

const findAllOpen = async () => {
  const [rows] = await pool.query('SELECT * FROM nanny_jobs WHERE status = "open" ORDER BY created_at DESC')
  return rows
}

const closeJob = async (id, nanny_id) => {
  await pool.query('UPDATE nanny_jobs SET status = "closed" WHERE id = ? AND nanny_id = ?', [id, nanny_id])
  return { id, status: 'closed' }
}

module.exports = { createJob, findByNanny, findAllOpen, closeJob }
