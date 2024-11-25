const express = require('express');
const { sendMessage, getMessages } = require('../controllers/chatController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Send a new message
router.post('/send', verifyToken, sendMessage);

// Get all messages
router.get('/messages', verifyToken, getMessages);

module.exports = router;
