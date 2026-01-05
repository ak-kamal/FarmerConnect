import Stripe from "stripe";
import Order from "../models/Order.js";
import Produce from "../models/Produce.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const BDT_TO_USD = 122;

const generateOrderCode = () => {
  const suffix = Date.now().toString().slice(-6);
  return `FC-ORD-${new Date().getFullYear()}-${suffix}`;
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { produceId, quantity } = req.body;

    if (!produceId || !quantity) {
      return res.status(400).json({ message: "Missing produceId or quantity" });
    }

    // 1️⃣ Fetch produce
    const produce = await Produce.findById(produceId);
    if (!produce) {
      return res.status(404).json({ message: "Produce not found" });
    }

    if (quantity > produce.quantity) {
      return res.status(400).json({ message: "Quantity exceeds available stock" });
    }

    // 2️⃣ Calculate prices
    const unitPriceBDT = Number(produce.pricePerUnit);
    const quantityOrdered = Number(quantity);

    const totalBDT = unitPriceBDT * quantityOrdered;
    const totalUSD = Number((totalBDT / BDT_TO_USD).toFixed(2));

    // 3️⃣ Create Order (PENDING)
    const orderCode = await generateOrderCode();

    const order = await Order.create({
      orderCode,
      produceId: produce._id,
      farmerId: produce.farmerId,
      wholesalerId: req.user._id,
      quantityOrdered,
      unitPriceBDT,
      totalBDT,
      totalUSD,
      status: "PENDING",
    });

    // 4️⃣ Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${produce.produceName} (${quantityOrdered} kg)`,
            },
            unit_amount: Math.round(totalUSD * 100), // cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/wholesaler/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("❌ Checkout error:", error);
    return res.status(500).json({ message: "Failed to start checkout" });
  }
};
