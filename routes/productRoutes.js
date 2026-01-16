import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { productValidation } from "../validators/commonValidators.js";
import { validate } from "../middleware/validate.js";

// ✅ Router MUST be declared BEFORE usage
const router = express.Router();

/**
 * PUBLIC
 */
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

/**
 * ADMIN
 */
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  productValidation,
  validate,
  createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  productValidation,
  validate,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteProduct
);

export default router;
