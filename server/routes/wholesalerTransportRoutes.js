import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { getAllTransportCompanies } from "../controllers/wholesalerTransportController.js";

const router = express.Router();

// Wholesaler: view transport companies
router.get(
  "/",
  protect,
  restrictTo("wholesaler"),
  getAllTransportCompanies
);

export default router;
