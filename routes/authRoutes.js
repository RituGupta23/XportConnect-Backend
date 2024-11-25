const express = require('express');
const { registerUser, loginUser, getUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login route (returns JWT token)
router.post('/login', loginUser);

//Get the user details based on the JWT token
router.get('/getUser', protect, getUser);

module.exports = router;
