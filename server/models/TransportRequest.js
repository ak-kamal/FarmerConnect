import mongoose from "mongoose";

const transportRequestSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    orderCode: {
      type: String,
      required: true,
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

    transportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmerDistrict: String,
    wholesalerDistrict: String,
    transportDistrict: String,

    estimatedFeeBDT: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TransportRequest", transportRequestSchema);
