import express from "express";
import { getMyOrders } from "../controllers/wholesalerOrderController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  getTransportPaymentOrders,
  createTransportPaymentSession,
} from "../controllers/wholesalerOrderController.js";

const router = express.Router();

// GET /api/wholesaler/my-orders
router.get(
  "/my-orders",
  protect,
  restrictTo("wholesaler"),
  getMyOrders
);

router.get(
  "/transport-payments",
  protect,
  restrictTo("wholesaler"),
  getTransportPaymentOrders
);

router.post(
  "/transport-payments/checkout",
  protect,
  restrictTo("wholesaler"),
  createTransportPaymentSession
);


export default router;
