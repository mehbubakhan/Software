const pool = require('../config/db')

// ── In-memory fallback (used when Railway DB is unreachable) ──────────
let mockNotifications = []
let mockIdCounter = 1

// ── DB-first helpers with in-memory fallback ────────────────────────────────

const createNotification = async ({ userId, title, message, type = 'system_alert' }) => {
  try {
    const query = 'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)'
    const [res] = await pool.query(query, [userId, title, message, type])
    return {
      id: res.insertId,
      user_id: userId,
      title,
      message,
      type,
      created_at: new Date().toISOString(),
      is_read: false
    }
  } catch (err) {
    console.warn('[Notification] DB unavailable, using in-memory store for createNotification')
    const id = mockIdCounter++
    const notif = {
      id,
      user_id: userId,
      title,
      message,
      type,
      created_at: new Date().toISOString(),
      is_read: false
    }
    mockNotifications.push(notif)
    return notif
  }
}

const findByUserId = async (userId) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId])
    return rows
  } catch (err) {
    console.warn('[Notification] DB unavailable, using in-memory store for findByUserId')
    return mockNotifications.filter(n => n.user_id == userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
}

const markAsRead = async (notificationId) => {
  try {
    await pool.query('UPDATE notifications SET is_read = true WHERE id = ?', [notificationId])
    return true
  } catch (err) {
    console.warn('[Notification] DB unavailable, using in-memory store for markAsRead')
    const notif = mockNotifications.find(n => n.id == notificationId)
    if (notif) notif.is_read = true
    return true
  }
}

module.exports = { createNotification, findByUserId, markAsRead }
