const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    // Basic user details
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      // Password is not required initially since FR-1 uses OTP for first access
      // and sets the password later. We'll add validation logic (hashing) in the controller later.
    },
    // Field for FR-1: 1. Used to verify the user during initial setup
    otp: {
      type: String,
      select: false, // Don't return the OTP by default in queries
    },
    // 2. Crucial for verifying if the user has completed the sign-up process
    isVerified: {
        type: Boolean,
        default: false,
    },
    // Field for FR-2/FR-3: Role-Based Access Control
    role: {
      type: String,
      // The allowed roles in our application
      enum: ['farmer', 'wholesaler', 'transport', 'admin'],
      required: [true, 'User role is required']
    },
    // 3. NEW: Required for OTP Expiration (5 minutes)
    otpExpires: {
        type: Date,
        select: false,
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('User', userSchema);