const jwt = require('jsonwebtoken');
const User=require('../Models/userModel');

require('dotenv').config();

const middleware = async (req, res, next) => {
    const token = req.header('x-auth-token');
    
    if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user role from the User model
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = {userRole:user.role,email:user.email,userId:user.id};
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = { middleware };