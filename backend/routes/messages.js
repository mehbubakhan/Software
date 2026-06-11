const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { getContacts, getConversations, getMessages, sendMessage } = require('../controllers/messagingController')

router.get('/contacts', auth, getContacts)
router.get('/', auth, getConversations)
router.get('/:userId', auth, getMessages)
router.post('/:userId', auth, sendMessage)

module.exports = router
