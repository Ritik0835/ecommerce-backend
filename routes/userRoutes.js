import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { registerValidation } from "../validators/commonValidators.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

/**
 * PUBLIC
 */
router.post("/register", registerValidation, validate, registerUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

/**
 * ADMIN
 */
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

export default router;
