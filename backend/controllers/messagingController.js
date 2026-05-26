const pool = require('../config/db')

const getConversations = async (req, res) => {
  try {
    const user_id = req.user.id
    const [conversations] = await pool.query(
      `SELECT c.* FROM conversations c 
       JOIN conversation_members cm ON c.id = cm.conversation_id 
       WHERE cm.user_id = ?`, [user_id]
    )
    return res.json({ ok: true, data: conversations })
  } catch(err) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}

const getMessages = async (req, res) => {
  try {
    const { id } = req.params
    const [messages] = await pool.query('SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC', [id])
    return res.json({ ok: true, data: messages })
  } catch(err) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}

module.exports = { getConversations, getMessages }
