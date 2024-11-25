// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect routes and check for JWT token in Authorization header
const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Check for user roles (only seller can access certain routes)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        next();
    };
};

module.exports = { protect, authorize };
