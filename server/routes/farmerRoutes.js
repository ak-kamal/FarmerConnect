import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadImage, createProduce, getMyProduce } from "../controllers/produceController.js";

const router = express.Router();

// Create new produce (FR-5)
router.post("/produce", protect, uploadImage, createProduce);

// Get all produce belonging to the logged-in farmer
router.get("/produce", protect, getMyProduce);

export default router;
