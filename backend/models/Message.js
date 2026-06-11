const pool = require('../config/db')

// ── In-memory fallback (used when Railway DB is unreachable) ──────────
let mockMessages = []
let mockIdCounter = 1

// ── DB-first helpers with in-memory fallback ────────────────────────────────

const createMessage = async ({ senderId, receiverId, content, room, type = 'direct' }) => {
  try {
    const query = 'INSERT INTO messages (sender_id, receiver_id, content, room, type) VALUES (?, ?, ?, ?, ?)'
    const [res] = await pool.query(query, [senderId, receiverId, content, room, type])
    return {
      id: res.insertId,
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      room,
      type,
      sent_at: new Date().toISOString(),
      is_read: false
    }
  } catch (err) {
    console.warn('[Message] DB unavailable, using in-memory store for createMessage')
    const id = mockIdCounter++
    const msg = {
      id,
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      room,
      type,
      sent_at: new Date().toISOString(),
      is_read: false
    }
    mockMessages.push(msg)
    return msg
  }
}

const findByUserId = async (userId) => {
  try {
    const [rows] = await pool.query('SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY sent_at ASC', [userId, userId])
    return rows
  } catch (err) {
    console.warn('[Message] DB unavailable, using in-memory store for findByUserId')
    return mockMessages.filter(m => m.sender_id == userId || m.receiver_id == userId).sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at))
  }
}

const findByRoom = async (room) => {
  try {
    const [rows] = await pool.query('SELECT * FROM messages WHERE room = ? ORDER BY sent_at ASC', [room])
    return rows
  } catch (err) {
    console.warn('[Message] DB unavailable, using in-memory store for findByRoom')
    return mockMessages.filter(m => m.room === room).sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at))
  }
}

const markAsRead = async (messageId) => {
  try {
    await pool.query('UPDATE messages SET is_read = true WHERE id = ?', [messageId])
    return true
  } catch (err) {
    console.warn('[Message] DB unavailable, using in-memory store for markAsRead')
    const msg = mockMessages.find(m => m.id == messageId)
    if (msg) msg.is_read = true
    return true
  }
}

module.exports = { createMessage, findByUserId, findByRoom, markAsRead }
