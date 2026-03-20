const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name icon')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const product = await Product.create({ ...data, images });
    await product.populate('category', 'name icon');
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    if (req.files && req.files.length > 0) {
      data.images = [...(data.images || []), ...req.files.map(f => `/uploads/${f.filename}`)];
    }
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
      .populate('category', 'name icon');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    product.isAvailable = !product.isAvailable;
    await product.save();
    res.json({ isAvailable: product.isAvailable });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
