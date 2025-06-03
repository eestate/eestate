import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
  console.log('Cookies:', req.cookies); // Debug cookies
  const token = req.cookies.token; // Changed from req.cookies.jwt

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded); // Debug decoded token
    req.user = await User.findById(decoded.id).select('-password'); // Changed userId to id

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    res.status(401);
    throw new Error('Not authorized, invalid token');
  }
});

export { protect };