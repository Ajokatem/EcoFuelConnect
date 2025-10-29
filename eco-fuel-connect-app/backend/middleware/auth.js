const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    // Read token from cookie for cookie-based authentication
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      if (!user) {
        return res.status(401).json({ message: 'Invalid token. User not found.' });
      }
      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated.' });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied. User not authenticated.' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }
    
    next();
  };
};

// Specific role middleware functions
const adminOnly = authorize('admin');
const managerOrAdmin = authorize('admin', 'manager');
const supplierOnly = authorize('supplier');
const schoolOnly = authorize('school');
const consumerOnly = authorize('consumer');
const supplierOrAdmin = authorize('supplier', 'admin');
const schoolOrAdmin = authorize('school', 'admin');
const consumerOrAdmin = authorize('consumer', 'admin');

// Optional auth middleware 
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

module.exports = {
  auth,
  authorize,
  adminOnly,
  managerOrAdmin,
  supplierOnly,
  schoolOnly,
  consumerOnly,
  supplierOrAdmin,
  schoolOrAdmin,
  consumerOrAdmin,
  optionalAuth
};