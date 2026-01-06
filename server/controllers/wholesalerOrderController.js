import Order from "../models/Order.js";

export const getMyOrders = async (req, res) => {
  try {
    const wholesalerId = req.user._id;

    const orders = await Order.find({
      wholesalerId: wholesalerId,
      status: "PAID",
    })
      .populate({
        path: "produceId",
        populate: {
          path: "farmerId",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching wholesaler orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getTransportPaymentOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      wholesalerId: req.user._id,
      deliveryStatus: "REACHED",
      transportPaymentStatus: "UNPAID",
    })
      .populate("farmerId", "name district email")
      .populate("transportId", "name district email");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to load transport payment orders" });
  }
};

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createTransportPaymentSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.transportPaymentStatus === "PAID") {
      return res.status(400).json({ message: "Transport already paid" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Transport fee for order ${order.orderCode}`,
            },
            unit_amount: Math.round((order.transportFeeBDT / 122) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/wholesaler/transport-payment-success?orderId=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: "Failed to create transport payment" });
  }
};

