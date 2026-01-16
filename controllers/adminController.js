import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

/**
 * GET ADMIN STATS
 * GET /api/admin/stats
 */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const paidOrders = await Order.countDocuments({ isPaid: true });
    const deliveredOrders = await Order.countDocuments({ isDelivered: true });

    const revenue = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json({
      users: totalUsers,
      products: totalProducts,
      orders: totalOrders,
      paidOrders,
      deliveredOrders,
      totalRevenue: revenue[0]?.totalRevenue || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
