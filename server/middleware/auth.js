const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Regular user authentication


// Admin authentication
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify this is an admin user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = {
  authenticateAdmin
}; 