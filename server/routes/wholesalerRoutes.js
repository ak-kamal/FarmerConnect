import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getProduceNameOptions,
  searchByProduceName,
  farmerSuggestions,
  searchByFarmer,
} from "../controllers/wholesalerSearchController.js";
import { getTopFarmers } from "../controllers/wholesalerFarmersController.js";

const router = express.Router();

// All routes protected
router.get("/produce-options", protect, getProduceNameOptions);
router.get("/search/produce", protect, searchByProduceName);
router.get("/search/farmers", protect, farmerSuggestions);
router.get("/search/farmer-produce", protect, searchByFarmer);
//router.get("/farmers", protect, roleCheck("wholesaler"), listFarmersForWholesaler);
router.get("/top-farmers", protect, getTopFarmers);

export default router;
