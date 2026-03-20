const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stock: { type: Number, default: 0, min: 0 },
  unit: { type: String, default: '1 piece' },
  images: [{ type: String }],
  tags: [{ type: String, enum: ['Bestseller', 'New', 'Trending', 'Sale', 'Featured'] }],
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
