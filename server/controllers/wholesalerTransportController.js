import User from "../models/User.js";
import TransportStats from "../models/TransportStats.js";
import asyncHandler from "express-async-handler";

export const getAllTransportCompanies = asyncHandler(async (req, res) => {
  // Only wholesalers allowed
  if (req.user.role !== "wholesaler") {
    res.status(403);
    throw new Error("Access denied.");
  }

  const transports = await User.find({
    role: "transport",
    adminStatus: "approved",
  }).select("name email location");

  const transportIds = transports.map((t) => t._id);

  const stats = await TransportStats.find({
    transportId: { $in: transportIds },
  });

  const statsMap = {};
  stats.forEach((s) => {
    statsMap[s.transportId.toString()] = s;
  });

  const result = transports.map((t) => {
    const stat = statsMap[t._id.toString()];
    const rating =
      stat && stat.ratingCount > 0
        ? (stat.ratingSum / stat.ratingCount).toFixed(1)
        : "New";

    return {
      _id: t._id,
      name: t.name,
      email: t.email,
      location: t.location,
      rating,
    };
  });

  res.json(result);
});
