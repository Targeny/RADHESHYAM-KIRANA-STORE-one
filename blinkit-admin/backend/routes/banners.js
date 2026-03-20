const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json(banners);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
    const banner = await Banner.create(data);
    res.status(201).json(banner);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
    const banner = await Banner.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!banner) return res.status(404).json({ message: 'Not found' });
    res.json(banner);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Not found' });
    banner.isActive = !banner.isActive;
    await banner.save();
    res.json({ isActive: banner.isActive });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
