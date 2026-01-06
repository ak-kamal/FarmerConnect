import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

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

    deliveryStatus: {
  type: String,
  enum: [
    "AWAITING_DELIVERY",
    "READY_TO_BE_PICKED",
    "ON_THE_WAY",
    "REACHED",
  ],
  default: "AWAITING_DELIVERY",
},

transportFeeBDT: {
  type: Number,
},

transportPaymentStatus: {
  type: String,
  enum: ["UNPAID", "PAID"],
  default: "UNPAID",
},

transportId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},


    stripeSessionId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
