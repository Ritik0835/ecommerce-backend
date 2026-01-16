import Order from "../models/Order.js";
import Product from "../models/Product.js";

/**
 * CREATE ORDER (USER)
 * POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    let totalPrice = 0;
    const items = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.qty) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }

      product.stock -= item.qty;
      await product.save();

      items.push({
        product: product._id,
        name: product.name,
        qty: item.qty,
        price: product.price,
      });

      totalPrice += product.price * item.qty;
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: items,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY ORDERS (USER)
 * GET /api/orders/my
 */
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

/**
 * GET ALL ORDERS (ADMIN)
 * GET /api/orders
 */
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("orderItems.product", "name");

  res.json(orders);
};

/**
 * GET SINGLE ORDER (USER / ADMIN)
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // User can only see their own order
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Invalid order ID" });
  }
};

/**
 * MARK ORDER AS PAID (USER)
 * PUT /api/orders/:id/pay
 */
export const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your order" });
    }

    order.isPaid = true;
    order.paidAt = new Date();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * MARK ORDER AS DELIVERED (ADMIN)
 * PUT /api/orders/:id/deliver
 */
export const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

