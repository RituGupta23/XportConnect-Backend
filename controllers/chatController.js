const Message = require('../models/Message');

// Send a new message
const sendMessage = async (req, res) => {
  const { text } = req.body;
  const senderId = req.user.userId;

  try {
    const newMessage = new Message({ sender: senderId, text });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error });
  }
};

// Get all messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('sender', 'username');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error });
  }
};

module.exports = { sendMessage, getMessages };
