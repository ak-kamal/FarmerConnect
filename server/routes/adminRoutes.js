import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/rbacMiddleware.js";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/pending-users", protect, checkRole(["admin"]), getPendingUsers);
router.post("/approve/:id", protect, checkRole(["admin"]), approveUser);
router.post("/reject/:id", protect, checkRole(["admin"]), rejectUser);

export default router;
