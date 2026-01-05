import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    wholesalerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    produceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produce",
      required: true,
    },

    // snapshot data (important)
    produceName: String,
    quantityOrdered: {
      type: Number,
      required: true,
    },
    unitPriceBDT: {
      type: Number,
      required: true,
    },
    totalBDT: {
      type: Number,
      required: true,
    },
    totalUSD: {
      type: Number,
      required: true,
    },
    conversionRate: {
      type: Number,
      default: 122,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },

    stripeSessionId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
