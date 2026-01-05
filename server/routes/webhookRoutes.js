import express from "express";
import { handleStripeWebhook } from "../controllers/stripeWebhookController.js";

const router = express.Router();

// IMPORTANT: raw body required
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
