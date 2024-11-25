// controllers/authController.js
const User = require('../models/userModel');
const { generateToken } = require('../utils/jwtHelper');
const jwt = require('jsonwebtoken');

// Register new user
const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        username,
        email,
        password,
        role,
    });

    if (user) {
        const token = generateToken(user._id);
        res.status(201).json({ user, token });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        // Check if user exists
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Respond with token and user details (including role)
        res.json({
            success: true,
            data: {
                token,
                user: {
                    email: user.email,
                    role: user.role, // Send the role
                },
            },
        });
    } catch (error) {
        console.error('Login Error:', error); // Logs error to the server console

        // Respond with generic error message
        res.status(500).json({
            message: 'Login failed',
            ...(process.env.NODE_ENV === 'development' && { error: error.message || error.stack }),
        });
    }
};

// Get user data based on JWT token
const getUser = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded token:', decoded); // Debugging line to check the decoded token

        const user = await User.findById(decoded.userId).select('-password'); // Fetch user from DB (excluding password)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ username: user.username, email: user.email, role: user.role });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(500).json({ message: 'Failed to authenticate token', error });
    }
};

module.exports = { registerUser, loginUser, getUser};
