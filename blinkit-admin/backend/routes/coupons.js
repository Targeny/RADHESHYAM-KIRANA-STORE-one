const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const coupons = await Coupon.find().populate('assignedTo', 'name email').sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Not found' });
    res.json(coupon);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Not found' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ isActive: coupon.isActive });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
