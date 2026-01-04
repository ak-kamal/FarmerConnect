import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getProduceNameOptions,
  searchByProduceName,
  farmerSuggestions,
  searchByFarmer,
} from "../controllers/wholesalerSearchController.js";

const router = express.Router();

// All routes protected
router.get("/produce-options", protect, getProduceNameOptions);
router.get("/search/produce", protect, searchByProduceName);
router.get("/search/farmers", protect, farmerSuggestions);
router.get("/search/farmer-produce", protect, searchByFarmer);

export default router;
