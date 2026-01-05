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
  },
  { timestamps: true }
);

export default mongoose.model("FarmerStats", farmerStatsSchema);
