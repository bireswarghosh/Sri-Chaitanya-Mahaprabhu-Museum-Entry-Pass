const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = 'museum_secret_key_2024';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      user_id: user.user_id, 
      username: user.username, 
      admin_role_id: user.admin_role_id,
      is_supper: user.is_supper 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Check if user is super admin
const isSuperAdmin = (req, res, next) => {
  if (req.user.is_supper !== 1) {
    return res.status(403).json({ error: 'Access denied. Super admin required.' });
  }
  next();
};

// Check if user is admin or super admin
const isAdmin = (req, res, next) => {
  if (req.user.admin_role_id < 1) {
    return res.status(403).json({ error: 'Access denied. Admin access required.' });
  }
  next();
};

module.exports = { generateToken, verifyToken, isSuperAdmin, isAdmin };