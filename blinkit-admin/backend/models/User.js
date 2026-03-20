const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, lowercase: true },
  phone: { type: String },
  addresses: [{ label: String, line1: String, city: String, pincode: String }],
  isBlocked: { type: Boolean, default: false },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
