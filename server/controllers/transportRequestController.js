import Order from "../models/Order.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import { calculateTransportFee } from "../utils/calculateTransportFee.js";

export const previewTransportFee = asyncHandler(async (req, res) => {
  const { orderCode, transportId } = req.body;

  if (!orderCode || !transportId) {
    res.status(400);
    throw new Error("Order ID and transport company are required.");
  }

  const order = await Order.findOne({ orderCode })
    .populate("farmer", "location")
    .populate("wholesaler", "location");

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (order.wholesaler._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("This order does not belong to you.");
  }

  if (order.paymentStatus !== "PAID") {
    res.status(400);
    throw new Error("Order is not paid.");
  }

  if (order.deliveryStatus !== "AWAITING_DELIVERY") {
    res.status(400);
    throw new Error("Order does not require delivery.");
  }

  const transport = await User.findById(transportId).select("location");

  if (!transport) {
    res.status(404);
    throw new Error("Transport company not found.");
  }

  const fee = calculateTransportFee({
    farmer: order.farmer.location,
    wholesaler: order.wholesaler.location,
    transport: transport.location,
  });

  res.json({ fee });
});
