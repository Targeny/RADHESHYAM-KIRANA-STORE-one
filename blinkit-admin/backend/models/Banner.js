const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  linkTo: { type: String, default: '/' },
  bgColor: { type: String, default: '#f0fdf4' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
