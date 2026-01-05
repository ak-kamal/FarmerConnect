import mongoose from "mongoose";

const farmerStatsSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    totalSales: { type: Number, default: 0 },
    totalQuantitySold: { type: Number, default: 0 },
    totalEarningsBDT: { type: Number, default: 0 },
    // add inside schema fields
    ratingSum: { type: Number, default: 0 },     // sum of all ratings (e.g., 5+4+5)
    ratingCount: { type: Number, default: 0 },   // how many ratings received
  },
  { timestamps: true }
);

export default mongoose.model("FarmerStats", farmerStatsSchema);
