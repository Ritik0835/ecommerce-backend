import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * ADMIN DASHBOARD
 */
router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

export default router;
