const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { getConversations, getMessages } = require('../controllers/messagingController')

router.get('/', auth, getConversations)
router.get('/:id', auth, getMessages)

module.exports = router
