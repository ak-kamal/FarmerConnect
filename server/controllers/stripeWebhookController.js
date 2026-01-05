import Stripe from "stripe";
import Order from "../models/Order.js";
import Produce from "../models/Produce.js";
import FarmerStats from "../models/FarmerStats.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ ONLY react to successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const orderId = session.metadata?.orderId;
      if (!orderId) throw new Error("Missing orderId in metadata");

      // 1️⃣ Find order
      const order = await Order.findById(orderId);
      if (!order) throw new Error("Order not found");

      // Prevent double processing
      if (order.status === "PAID") {
        return res.json({ received: true });
      }

      // 2️⃣ Mark order PAID
      order.status = "PAID";
      await order.save();

      // 3️⃣ Reduce produce quantity
      const produce = await Produce.findById(order.produceId);
      if (!produce) throw new Error("Produce not found");

      produce.quantity -= order.quantityOrdered;

      if (produce.quantity <= 0) {
        produce.quantity = 0;
        produce.status = "SOLD";
      }

      await produce.save();

      // 4️⃣ Update farmer ranking stats
      await FarmerStats.updateOne(
        { farmerId: order.farmerId },
        {
          $inc: {
            totalSales: 1,
            totalQuantitySold: order.quantityOrdered,
            totalEarningsBDT: order.totalBDT,
          },
        },
        { upsert: true }
      );

      console.log("✅ Payment processed for order:", orderId);
    } catch (err) {
      console.error("❌ Webhook processing error:", err.message);
      return res.status(500).json({ error: "Webhook handler failed" });
    }
  }

  res.json({ received: true });
};
