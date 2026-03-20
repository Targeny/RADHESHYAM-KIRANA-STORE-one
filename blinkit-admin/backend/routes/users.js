const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id/orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(20);
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/block', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ isBlocked: user.isBlocked });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
