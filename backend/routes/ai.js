const express = require('express');
const router = express.Router();
const { chatWithParent } = require('../controllers/aiController');

// All AI routes under /api/ai
router.post('/chat', chatWithParent);

module.exports = router;
