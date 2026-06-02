const pool = require('../config/db')

// ── In-memory fallback users (used when Railway DB is unreachable) ──────────
const bcrypt = require('bcrypt')
const saltRounds = 10

// Pre-seeded admin user for testing (password: admin123)
let mockUsers = []
let mockIdCounter = 900

// Seed on first load
;(async () => {
  try {
    const hash = await bcrypt.hash('admin123', saltRounds)
    mockUsers.push(
      { id: 900, name: 'System Admin', email: 'admin@smartnanny.com', password: hash, role: 'admin' },
    )
    // Also seed a nanny user for SOS testing
    const nannyHash = await bcrypt.hash('nanny123', saltRounds)
    mockUsers.push(
      { id: 901, name: 'Maria Mim', email: 'maria@nanny.com', password: nannyHash, role: 'nanny' },
    )
    mockIdCounter = 902
    console.log('[User] In-memory fallback users seeded (admin@smartnanny.com / admin123)')
  } catch (e) {
    console.error('[User] Failed to seed mock users', e)
  }
})()

// ── DB-first helpers with in-memory fallback ────────────────────────────────

const createUser = async ({ name, email, passwordHash, role }) => {
  try {
    const [res] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, passwordHash, role])
    return { id: res.insertId, name, email, role }
  } catch (err) {
    console.warn('[User] DB unavailable, using in-memory store for createUser')
    const id = mockIdCounter++
    mockUsers.push({ id, name, email, password: passwordHash, role })
    return { id, name, email, role }
  }
}

const findByEmail = async (email) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    return rows[0]
  } catch (err) {
    console.warn('[User] DB unavailable, using in-memory store for findByEmail')
    return mockUsers.find(u => u.email === email) || null
  }
}

const findById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [id])
    return rows[0]
  } catch (err) {
    console.warn('[User] DB unavailable, using in-memory store for findById')
    const user = mockUsers.find(u => u.id == id)
    if (user) return { id: user.id, name: user.name, email: user.email, role: user.role }
    return null
  }
}

module.exports = { createUser, findByEmail, findById }
