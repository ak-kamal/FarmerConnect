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
