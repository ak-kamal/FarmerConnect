import Order from "../models/Order.js";
import User from "../models/User.js";
import TransportRequest from "../models/TransportRequest.js";
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

export const sendTransportRequest = asyncHandler(async (req, res) => {
  const { orderCode, transportId } = req.body;

  if (!orderCode || !transportId) {
    res.status(400);
    throw new Error("Order ID and transport company are required.");
  }

  const order = await Order.findOne({ orderCode });

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (order.wholesalerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("This order does not belong to you.");
  }

  if (order.status !== "PAID") {
    res.status(400);
    throw new Error("Order is not paid.");
  }

  if (order.deliveryStatus !== "AWAITING_DELIVERY") {
    res.status(400);
    throw new Error("Order does not require delivery.");
  }

  const farmer = await User.findById(order.farmerId);
  const transport = await User.findById(transportId);

  if (!transport) {
    res.status(404);
    throw new Error("Transport company not found.");
  }

  const fee = calculateTransportFee({
    farmer: farmer.location,
    wholesaler: req.user.location,
    transport: transport.location,
  });

  await TransportRequest.create({
    orderId: order._id,
    orderCode,
    wholesalerId: req.user._id,
    farmerId: farmer._id,
    transportId,
    farmerDistrict: farmer.location.district,
    wholesalerDistrict: req.user.location.district,
    transportDistrict: transport.location.district,
    estimatedFeeBDT: fee,
  });

  res.json({ message: "Transport request sent successfully." });
});

export const getMyTransportOffers = asyncHandler(async (req, res) => {
  const offers = await TransportRequest.find({
    transportId: req.user._id,
    status: "PENDING",
  }).sort({ createdAt: -1 });

  res.json(offers);
});

export const acceptTransportOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate("farmerId", "location")
    .populate("wholesalerId", "location");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.transportId) {
    res.status(400);
    throw new Error("Order already assigned to a transport");
  }

  // ✅ calculate fee HERE
  const fee = calculateTransportFee({
    farmer: order.farmerId.location,
    wholesaler: order.wholesalerId.location,
    transport: req.user.location,
  });

  // ✅ SAVE EVERYTHING
  order.transportId = req.user._id;
  order.transportFee = fee;              // 🔥 THIS WAS MISSING
  order.deliveryStatus = "READY_TO_BE_PICKED";

  await order.save();

  res.json({
    message: "Transport offer accepted",
    transportFee: fee,
  });
});


export const getCurrentDeliveries = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    deliveryStatus: { $in: ["READY_TO_BE_PICKED", "ON_THE_WAY"] },
  })
    .populate("farmerId", "name email district")
    .populate("wholesalerId", "name email district")
    .sort({ updatedAt: -1 });

  res.json(orders);
});

export const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["ON_THE_WAY", "REACHED"].includes(status)) {
    res.status(400);
    throw new Error("Invalid delivery status");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.deliveryStatus = status;
  await order.save();

  res.json({ message: "Delivery status updated" });
});

