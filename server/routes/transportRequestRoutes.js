import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  previewTransportFee,
  sendTransportRequest,
  getMyTransportOffers,
  acceptTransportOffer,
  getCurrentDeliveries,
  updateDeliveryStatus,
} from "../controllers/transportRequestController.js";

const router = express.Router();

/* =========================
   WHOLESALER ROUTES
========================= */
router.post(
  "/preview-fee",
  protect,
  restrictTo("wholesaler"),
  previewTransportFee
);

router.post(
  "/request",
  protect,
  restrictTo("wholesaler"),
  sendTransportRequest
);

/* =========================
   TRANSPORT ROUTES
========================= */
router.get(
  "/offers",
  protect,
  restrictTo("transport"),
  getMyTransportOffers
);

router.post(
  "/accept/:id",
  protect,
  restrictTo("transport"),
  acceptTransportOffer
);

router.get(
  "/current-deliveries",
  protect,
  restrictTo("transport"),
  getCurrentDeliveries
);

router.post(
  "/update-delivery/:id",
  protect,
  restrictTo("transport"),
  updateDeliveryStatus
);


export default router;
