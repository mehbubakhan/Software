const pool = require('../config/db')
const { createMessage, findByUserId, markAsRead } = require('../models/Message')
const { findAllUsers } = require('../models/User')

// Get all contacts (for the "New Chat" feature)
const getContacts = async (req, res) => {
  try {
    const user_id = req.user.id
    
    const allUsers = await findAllUsers()
    const users = allUsers.filter(u => u.id != user_id)
    
    // Add dummy avatar
    const formatted = users.map(u => ({
      id: u.id,
      name: u.name,
      role: u.role,
      avatar: 'https://i.pravatar.cc/150?img=' + u.id
    }))

    console.log('[Messaging] Sending contacts count:', formatted.length)
    return res.json({ ok: true, data: formatted })
  } catch(err) {
    console.error('[Messaging] Error fetching contacts:', err)
    return res.status(500).json({ ok: false, error: err.message })
  }
}

// Get recent conversations for the current user
const getConversations = async (req, res) => {
  try {
    const user_id = req.user.id
    
    // Fetch all messages for the current user (using the fallback-aware model)
    const allMessages = await findByUserId(user_id)
    
    // Group messages by the "other" user
    const conversationsMap = new Map()

    allMessages.forEach(msg => {
      const otherId = msg.sender_id == user_id ? msg.receiver_id : msg.sender_id
      
      if (!conversationsMap.has(otherId)) {
        conversationsMap.set(otherId, {
          id: otherId,
          lastMessage: msg.content,
          time: new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date(msg.sent_at).getTime(),
          unread: msg.receiver_id == user_id && !msg.is_read ? 1 : 0
        })
      } else {
        const existing = conversationsMap.get(otherId)
        // If this message is newer, update the last message
        if (new Date(msg.sent_at).getTime() > existing.timestamp) {
          existing.lastMessage = msg.content
          existing.time = new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          existing.timestamp = new Date(msg.sent_at).getTime()
        }
        if (msg.receiver_id == user_id && !msg.is_read) {
          existing.unread += 1
        }
      }
    })

    // Now enrich with user details
    const conversations = Array.from(conversationsMap.values()).sort((a, b) => b.timestamp - a.timestamp)
    
    for (let conv of conversations) {
      try {
        const [u] = await pool.query('SELECT name, role FROM users WHERE id = ?', [conv.id])
        if (u && u.length > 0) {
          conv.name = u[0].name
          conv.role = u[0].role
          conv.avatar = 'https://i.pravatar.cc/150?img=' + conv.id
        } else {
          conv.name = 'Unknown User'
          conv.role = 'unknown'
        }
      } catch (err) {
        conv.name = 'User ' + conv.id
        conv.role = 'member'
      }
    }

    return res.json({ ok: true, data: conversations })
  } catch(err) {
    console.error('[Messaging] Error fetching conversations:', err)
    return res.status(500).json({ ok: false, error: err.message })
  }
}

// Get messages for a specific user chat
const getMessages = async (req, res) => {
  try {
    const user_id = req.user.id
    const target_user_id = req.params.userId
    
    const allMessages = await findByUserId(user_id)
    
    // Filter messages that are between user_id and target_user_id
    const chatMessages = allMessages.filter(m => 
      (m.sender_id == user_id && m.receiver_id == target_user_id) ||
      (m.sender_id == target_user_id && m.receiver_id == user_id)
    )
    
    return res.json({ ok: true, data: chatMessages })
  } catch(err) {
    console.error('[Messaging] Error fetching messages:', err)
    return res.status(500).json({ ok: false, error: err.message })
  }
}

// Fallback HTTP route for sending messages (if sockets fail)
const sendMessage = async (req, res) => {
  try {
    const user_id = req.user.id
    const receiver_id = req.params.userId
    const { content, type } = req.body
    
    const message = await createMessage({
      senderId: user_id,
      receiverId: receiver_id,
      content,
      type: type || 'direct'
    })
    
    return res.json({ ok: true, data: message })
  } catch(err) {
    console.error('[Messaging] Error sending message via HTTP:', err)
    return res.status(500).json({ ok: false, error: err.message })
  }
}

module.exports = { getContacts, getConversations, getMessages, sendMessage }
