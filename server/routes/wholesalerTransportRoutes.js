import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllTransportCompanies } from "../controllers/wholesalerTransportController.js";

const router = express.Router();

// Wholesaler-only
router.get(
  "/",
  protect,
  getAllTransportCompanies
);

export default router;
