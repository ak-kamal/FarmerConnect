// server/controllers/userController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/emailService.js";

// --- Helper Functions ---

// Generates a 6-digit random code for verification
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generates a JWT token containing user's ID and ROLE in the payload
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// --- FR-1 Controller Functions ---

// @desc    Register a new user and send OTP (Initial Sign Up)
// @route   POST /api/users/signup
// @access  Public
export const signUp = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body; // No password yet

  if (!name || !email) {
    res.status(400);
    throw new Error("Please include a name and email.");
  }

  let user = await User.findOne({ email });
  const verificationCode = generateVerificationCode();

  // Set OTP expiration to 5 minutes from now
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  if (user && user.isVerified) {
    res.status(409);
    throw new Error("User with this email is already registered and verified.");
  }

  if (user && !user.isVerified) {
    // User exists but is unverified, update OTP and resend
    user.otp = verificationCode;
    user.otpExpires = otpExpires;
    await user.save();
  } else {
    // Create a brand new user document
    user = await User.create({
      name,
      email,
      role: role,
      otp: verificationCode,
      otpExpires: otpExpires,
      isVerified: false,
    });
  }

  // Send the verification email
  await sendVerificationEmail(email, verificationCode);

  res.status(200).json({
    message: "Registration successful! Check your email for the verification code.",
    email: user.email,
    needsPassword: true, // Signal client to proceed to OTP verification
  });
});

// @desc    Verify OTP and mark user as verified
// @route   POST /api/users/verify
// @access  Public
export const verifyAccount = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Find the user, explicitly requesting the otp and otpExpires fields
  const user = await User.findOne({ email }).select("+otp +otpExpires");

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("Account already verified. Please log in.");
  }

  // 1. Check for expiration (5-minute rule)
  if (user.otpExpires < Date.now()) {
    res.status(400);
    throw new Error("Verification code expired. Please request a new one.");
  }

  // 2. Check for code match
  if (user.otp !== otp) {
    res.status(400);
    throw new Error("Invalid verification code.");
  }

  // Verification successful: Update status and clear temporary fields
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({
    message: "Account verified. Proceed to set your password.",
  });
});

// @desc    Allow user to set their password after verification
// @route   POST /api/users/set-password
// @access  Public (email-based step)
export const setPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({ email });

  if (!user || !user.isVerified) {
    res.status(401);
    throw new Error("Unauthorized or account not verified.");
  }

  if (user.password) {
    res.status(400);
    throw new Error("Password already set for this account.");
  }

  // Hash and save password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  // Password set successfully, log the user in by generating the final JWT
  res.status(200).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role), // <-- Final JWT for session
    message: "Password set and login successful!",
  });
});

// @desc    Log in an already verified user
// @route   POST /api/users/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials.");
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error("Account is not verified. Please verify your email first.");
  }

  if (!user.password) {
    res.status(403);
    throw new Error(
      "Account requires password setup. Please complete verification process."
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (user && isMatch) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
      message: "Login successful!",
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials.");
  }
});

// @desc    Resend the verification OTP
// @route   POST /api/users/resend-otp
// @access  Public
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Generic success message to prevent email enumeration
    return res.status(200).json({
      message: "If an account exists, a new verification code has been sent.",
    });
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("Account is already verified.");
  }

  const verificationCode = generateVerificationCode();

  user.otp = verificationCode;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  await sendVerificationEmail(email, verificationCode);

  res.status(200).json({
    message: "A new verification code has been sent to your email.",
  });
});

// @desc    Log out user
// @route   POST /api/users/logout
// @access  Public (client just deletes token)
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Logout successful. Please remove your local authentication token.",
  });
});
