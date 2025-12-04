import express from 'express';
import { createProduce, uploadImage } from '../controllers/produceController.js'; 
import { protect, farmerOnly } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/produce', protect, farmerOnly, uploadImage, createProduce);

export default router;