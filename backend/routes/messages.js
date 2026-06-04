const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { getConversations, getMessages, sendMessage } = require('../controllers/messagingController')

router.get('/', auth, getConversations)
router.get('/:id', auth, getMessages)
router.post('/:id', auth, sendMessage)

module.exports = router
