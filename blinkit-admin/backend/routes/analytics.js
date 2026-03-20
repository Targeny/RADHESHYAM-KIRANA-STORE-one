const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

router.get('/summary', protect, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const [totalOrders, totalUsers, totalProducts, todayOrders, monthlyRevenue, pendingOrders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: monthStart }, orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments({ orderStatus: { $in: ['Received', 'Packed'] } }),
    ]);
    res.json({
      totalOrders, totalUsers, totalProducts, todayOrders, pendingOrders,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/chart', protect, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const from = new Date();
    from.setDate(from.getDate() - days + 1);
    from.setHours(0, 0, 0, 0);
    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: from }, orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const result = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(from); d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const found = data.find(x => x._id === key);
      result.push({ date: key, revenue: found?.revenue || 0, orders: found?.orders || 0 });
    }
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/top-products', protect, async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.name', sold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { sold: -1 } },
      { $limit: 5 },
    ]);
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
