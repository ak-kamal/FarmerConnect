import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createCheckoutSession } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-checkout", protect, createCheckoutSession);

export default router;
