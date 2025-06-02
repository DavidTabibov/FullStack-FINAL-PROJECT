import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Protect routes - middleware to check if user is authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.userId || decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin middleware - check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Check user activity and auto logout
const checkLastActivity = (req, res, next) => {
  const lastActivity = req.session?.lastActivity;
  const currentTime = Date.now();
  const maxInactiveTime = 4 * 60 * 60 * 1000; // 4 hours

  if (lastActivity && (currentTime - lastActivity > maxInactiveTime)) {
    req.session.destroy();
    return res.status(401).json({ error: 'Session expired due to inactivity' });
  }

  req.session.lastActivity = currentTime;
  next();
};

// Rate limiter middleware
const rateLimiter = (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const requestsPerDay = 1000; // Maximum requests per day
  const now = Date.now();
  const dayStart = new Date().setHours(0, 0, 0, 0);

  req.user.requestCount = req.user.requestCount || 0;
  req.user.requestReset = req.user.requestReset || dayStart;

  if (now > req.user.requestReset) {
    req.user.requestCount = 0;
    req.user.requestReset = dayStart;
  }

  if (req.user.requestCount >= requestsPerDay) {
    return res.status(429).json({ error: 'Daily request limit exceeded' });
  }

  req.user.requestCount++;
  next();
};

export {
  protect,
  admin,
  errorHandler,
  checkLastActivity,
  rateLimiter
};