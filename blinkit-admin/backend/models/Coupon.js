const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  maxDiscount: { type: Number, default: null },
  minOrderValue: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isActive: { type: Boolean, default: true },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
