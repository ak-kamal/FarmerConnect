import mongoose from "mongoose";

const transportStatsSchema = new mongoose.Schema(
  {
    transportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    ratingSum: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TransportStats", transportStatsSchema);
