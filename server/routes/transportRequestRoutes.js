import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { previewTransportFee } from "../controllers/transportRequestController.js";

const router = express.Router();

router.post("/preview-fee", protect, previewTransportFee);

export default router;