const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('No authentication token, access denied');
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find user by id
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            throw new Error('User not found');
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            error: 'Please authenticate',
            message: error.message 
        });
    }
};

module.exports = auth; 