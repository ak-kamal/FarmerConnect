// server/routes/authRoutes.js
import express from "express";
import {
  signUp,
  verifyAccount,
  setPassword,
  login,
  resendOtp,
  logout,
} from "../controllers/userController.js";

const router = express.Router();

// --- FR-1: Authentication Routes (Public Access) ---

// 1. Initial Registration
router.post("/signup", signUp);

// 2. OTP Confirmation
router.post("/verify", verifyAccount);

// 3. Password Setup
router.post("/set-password", setPassword);

// 4. Standard Login
router.post("/login", login);

// 5. OTP Resend
router.post("/resend-otp", resendOtp);

// 6. Logout (client deletes token)
router.post("/logout", logout);

export default router;
