const express = require('express');
const router = express.Router();
const { 
  signUp, 
  verifyAccount, 
  setPassword, 
  login, 
  resendOtp, 
  logout 
} = require('../controllers/userController'); // Note: Using userController functions

// Import security middleware (though not used on public auth routes)
// const { protect } = require('../middleware/authMiddleware'); 

// --- FR-1: Authentication Routes (Public Access) ---

// 1. Initial Registration
router.post('/signup', signUp);

// 2. OTP Confirmation
router.post('/verify', verifyAccount);

// 3. Password Setup (Assumes a temporary token/email is used for access)
router.post('/set-password', setPassword);

// 4. Standard Login
router.post('/login', login);

// 5. OTP Resend
router.post('/resend-otp', resendOtp);

// 6. Logout (Client deletes token, server confirms)
router.post('/logout', logout); 

module.exports = router;