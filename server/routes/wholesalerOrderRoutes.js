import express from "express";
import { getMyOrders } from "../controllers/wholesalerOrderController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/wholesaler/my-orders
router.get(
  "/my-orders",
  protect,
  restrictTo("wholesaler"),
  getMyOrders
);

export default router;
