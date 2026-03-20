const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: String,
  customerPhone: String,
  items: [orderItemSchema],
  subtotal: Number,
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: Number,
  couponApplied: { type: String, default: null },
  paymentMethod: { type: String, enum: ['COD', 'Online', 'UPI'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
  orderStatus: {
    type: String,
    enum: ['Received', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Received',
  },
  address: { line1: String, city: String, pincode: String },
  notes: { type: String, default: '' },
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'BLK' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
