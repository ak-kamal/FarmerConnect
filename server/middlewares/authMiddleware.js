const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Import the User model you defined

/**
 * Middleware to protect routes by verifying a JWT.
 * It identifies the user and attaches the user document to the request object (req.user).
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check for the token in the Authorization header
  // Format is usually: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token
      // The JWT payload typically contains the user ID (_id)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the token payload (excluding the password field)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401); // 401 Unauthorized
        throw new Error('User not found or token invalid.');
      }

      // 4. Attach the user object to the request for subsequent middleware/controllers
      // IMPORTANT: This makes req.user.role available for rbacMiddleware.js
      req.user = user;

      // Proceed to the next middleware (potentially rbacMiddleware)
      next();
    } catch (error) {
      console.error(error);
      res.status(401); // 401 Unauthorized
      throw new Error('Not authorized, token failed or expired.');
    }
  }

  // If no token is found in the header
  if (!token) {
    res.status(401); // 401 Unauthorized
    throw new Error('Not authorized, no token provided.');
  }
});

module.exports = { protect };