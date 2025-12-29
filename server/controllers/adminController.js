import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { sendApprovalEmail, sendRejectionEmail } from "../utils/emailService.js";

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

export const getPendingUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    role: { $ne: "admin" },
    isVerified: true,
    password: { $exists: true, $ne: "" },
    adminStatus: { $ne: "approved" },
  }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: users });
});

export const approveUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  user.adminStatus = "approved";
  user.adminReviewedAt = new Date();
  user.adminFeedback = undefined;
  await user.save();

  await sendApprovalEmail(user.email, `${clientUrl}/login`);

  res.status(200).json({ success: true, message: "User approved." });
});

export const rejectUser = asyncHandler(async (req, res) => {
  const { feedback } = req.body;

  if (!feedback || feedback.trim().length < 5) {
    res.status(400);
    throw new Error("Feedback is required for rejection.");
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  await sendRejectionEmail(user.email, feedback, `${clientUrl}/`);

  await User.deleteOne({ _id: user._id });

  res.status(200).json({ success: true, message: "User rejected and removed." });
});
