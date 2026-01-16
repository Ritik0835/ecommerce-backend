import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { orderValidation } from "../validators/commonValidators.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

/**
 * USER
 */
router.post("/", protect, orderValidation, validate, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, markOrderAsPaid);

/**
 * ADMIN
 */
router.get("/", protect, authorizeRoles("admin"), getAllOrders);
router.put("/:id/deliver", protect, authorizeRoles("admin"), markOrderAsDelivered);

export default router;
