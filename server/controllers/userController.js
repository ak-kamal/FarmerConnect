// server/controllers/userController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import cloudinary from "../config/cloudinary.js";
import { DISTRICT_TO_DIVISION } from "../utils/districtToDivision.js";

// --- Helper Functions ---
const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

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
  const { name, email, role, district } = req.body;

  // Basic validation first (before uploading to Cloudinary)
  if (!name || !email || !role) {
    res.status(400);
    throw new Error("Name, email, and role are required.");
  }

  if (!district) {
  res.status(400);
  throw new Error("District selection is required.");
}

const division = DISTRICT_TO_DIVISION[district];
if (!division) {
  res.status(400);
  throw new Error("Invalid district selected.");
}


  // Prevent normal signup as admin (admins are created by script)
  if (role === "admin") {
    res.status(400);
    throw new Error("Admin accounts cannot be created from signup.");
  }

  const nidFront = req.files?.nidFront?.[0];
  const nidBack = req.files?.nidBack?.[0];

  if (!nidFront || !nidBack) {
    res.status(400);
    throw new Error("NID front and back images are required.");
  }

  // Now upload NID images
  const frontUpload = await uploadBufferToCloudinary(
    nidFront.buffer,
    "farmer-connect/nid/front"
  );
  const backUpload = await uploadBufferToCloudinary(
    nidBack.buffer,
    "farmer-connect/nid/back"
  );

  const nidFrontUrl = frontUpload.secure_url;
  const nidBackUrl = backUpload.secure_url;

  let user = await User.findOne({ email });
  const verificationCode = generateVerificationCode();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  // If already verified -> block
  if (user && user.isVerified) {
    res.status(409);
    throw new Error("User with this email is already registered and verified.");
  }

  // If exists but not verified -> update OTP + also update NID/name/role
  if (user && !user.isVerified) {
    user.name = name;
    user.role = role;
    user.nidFrontUrl = nidFrontUrl;
    user.nidBackUrl = nidBackUrl;
    user.adminStatus = "pending";
    user.location = { district, division };

    user.otp = verificationCode;
    user.otpExpires = otpExpires;

    await user.save();
  } else {
    user = await User.create({
      name,
      email,
      role,
      location: {
  district,
  division,
},
      otp: verificationCode,
      otpExpires,
      isVerified: false,
      nidFrontUrl,
      nidBackUrl,
      adminStatus: "pending",
    });

    if (user.role === "farmer" && !user.farmerCode) {
      user.farmerCode = `FARM-${String(user._id).slice(-6).toUpperCase()}`;
      await user.save();
    }
  }

  await sendVerificationEmail(email, verificationCode);

  res.status(200).json({
    message:
      "Registration successful! Check your email for the verification code.",
    email: user.email,
    needsPassword: true,
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
  // If admin -> allow token normally
  if (user.role === "admin") {
    return res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminStatus: user.adminStatus || "approved",
      token: generateToken(user._id, user.role),
      message: "Password set and login successful!",
    });
  }

  // Non-admin: do not issue token until admin approves
  return res.status(200).json({
    message: "Password set successfully. Awaiting admin verification.",
    adminStatus: user.adminStatus || "pending",
    role: user.role,
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

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials.");
  }

  // Admin: login immediately
  if (user.role === "admin") {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminStatus: user.adminStatus || "approved",
      token: generateToken(user._id, user.role),
    });
  }

  // Non-admin but not approved
  if (user.adminStatus !== "approved") {
    return res.status(403).json({
      message: "Admin verification pending. Kindly wait for approval email.",
      code: "ADMIN_PENDING",
    });
  }

  // Approved non-admin
  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    adminStatus: user.adminStatus,
    token: generateToken(user._id, user.role),
    message: "Login successful!",
  });
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
