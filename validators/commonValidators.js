import { body } from "express-validator";

export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const productValidation = [
  body("name").notEmpty().withMessage("Product name required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("description").notEmpty().withMessage("Description required"),
  body("category").notEmpty().withMessage("Category required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be 0 or more"),
];

export const orderValidation = [
  body("orderItems")
    .isArray({ min: 1 })
    .withMessage("Order items required"),
  body("orderItems.*.product")
    .notEmpty()
    .withMessage("Product ID required"),
  body("orderItems.*.qty")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];
