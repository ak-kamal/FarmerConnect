import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadImage, createProduce, getMyProduce, updateMyProduce, deleteMyProduce } from "../controllers/produceController.js";

const router = express.Router();

// Create new produce (FR-5)
router.post("/produce", protect, uploadImage, createProduce);

// Get all produce belonging to the logged-in farmer
router.get("/produce", protect, getMyProduce);

// Update existing produce (image optional)
router.put("/produce/:id", protect, uploadImage, updateMyProduce);

// delete produce
router.delete("/produce/:id", protect, deleteMyProduce);

export default router;
