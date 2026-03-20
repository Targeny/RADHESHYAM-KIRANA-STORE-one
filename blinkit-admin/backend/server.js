const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5174', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';
const DEMO_MODE = !process.env.MONGO_URI || process.env.MONGO_URI.trim() === '' || process.env.DEMO_MODE === 'true';

if (DEMO_MODE) {
  console.log('⚡ Running in DEMO MODE (no MongoDB required)');
  console.log('   Login: admin@blinkit.com / Admin@123');

  // ── In-memory stores ──────────────────────────────────────────────
  const db = {
    products: [
      { _id: 'p1', name: 'Amul Butter 500g', price: 280, mrp: 310, stock: 45, category: 'Dairy', isAvailable: true, images: [] },
      { _id: 'p2', name: 'Tropicana Orange Juice 1L', price: 110, mrp: 130, stock: 20, category: 'Beverages', isAvailable: true, images: [] },
      { _id: 'p3', name: 'Aashirvaad Atta 10kg', price: 420, mrp: 470, stock: 15, category: 'Staples', isAvailable: true, images: [] },
      { _id: 'p4', name: 'Lays Classic Salted 26g', price: 20, mrp: 20, stock: 100, category: 'Snacks', isAvailable: true, images: [] },
      { _id: 'p5', name: 'Dettol Soap 75g', price: 35, mrp: 42, stock: 60, category: 'Personal Care', isAvailable: false, images: [] },
    ],
    categories: [
      { _id: 'c1', name: 'Dairy & Eggs', icon: '🥛', isActive: true },
      { _id: 'c2', name: 'Fruits & Vegetables', icon: '🥦', isActive: true },
      { _id: 'c3', name: 'Snacks', icon: '🍎', isActive: true },
      { _id: 'c4', name: 'Beverages', icon: '🥤', isActive: true },
      { _id: 'c5', name: 'Personal Care', icon: '🧴', isActive: false },
    ],
    orders: [
      { _id: 'o1', orderNumber: '#BL10001', customerName: 'Rahul Sharma', customerPhone: '9876543210', items: [{ name: 'Amul Butter', quantity: 2, price: 140 }], totalAmount: 280, paymentMethod: 'UPI', paymentStatus: 'Paid', orderStatus: 'Delivered', address: { line1: '12 MG Road', city: 'Bangalore', pincode: '560001' }, createdAt: new Date(Date.now() - 86400000 * 2) },
      { _id: 'o2', orderNumber: '#BL10002', customerName: 'Priya Mehta', customerPhone: '9123456789', items: [{ name: 'Lays', quantity: 5, price: 20 }], totalAmount: 100, paymentMethod: 'COD', paymentStatus: 'Pending', orderStatus: 'Packed', address: { line1: '45 Park Street', city: 'Mumbai', pincode: '400001' }, createdAt: new Date(Date.now() - 86400000) },
      { _id: 'o3', orderNumber: '#BL10003', customerName: 'Amit Verma', customerPhone: '9988776655', items: [{ name: 'Aashirvaad Atta', quantity: 1, price: 420 }], totalAmount: 420, paymentMethod: 'Card', paymentStatus: 'Paid', orderStatus: 'Out for Delivery', address: { line1: '78 Civil Lines', city: 'Delhi', pincode: '110001' }, createdAt: new Date() },
    ],
    users: [
      { _id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', isBlocked: false, orderCount: 5, createdAt: new Date(Date.now() - 86400000 * 30) },
      { _id: 'u2', name: 'Priya Mehta', email: 'priya@example.com', phone: '9123456789', isBlocked: false, orderCount: 3, createdAt: new Date(Date.now() - 86400000 * 15) },
      { _id: 'u3', name: 'Spammer Bot', email: 'spam@junk.com', phone: '0000000000', isBlocked: true, orderCount: 0, createdAt: new Date(Date.now() - 86400000 * 5) },
    ],
    coupons: [
      { _id: 'cp1', code: 'FIRST50', discountType: 'flat', discountValue: 50, minOrderValue: 200, maxDiscount: 50, usageLimit: 100, usedCount: 12, expiryDate: new Date(Date.now() + 86400000 * 30), isActive: true },
      { _id: 'cp2', code: 'SAVE20', discountType: 'percentage', discountValue: 20, minOrderValue: 300, maxDiscount: 100, usageLimit: 50, usedCount: 50, expiryDate: new Date(Date.now() - 86400000), isActive: false },
    ],
    banners: [
      { _id: 'b1', title: 'Weekend Mega Sale', imageUrl: '', linkTo: '/offers', isActive: true, order: 1 },
      { _id: 'b2', title: 'Dairy Delights', imageUrl: '', linkTo: '/categories/dairy', isActive: true, order: 2 },
    ],
  };

  let idCounter = 100;
  const newId = () => `demo_${++idCounter}`;

  // ── Auth ──────────────────────────────────────────────────────────
  const ADMIN = { _id: 'admin1', name: 'Admin User', email: 'admin@blinkit.com', password: 'Admin@123', role: 'admin' };

  const authMiddleware = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    try {
      jwt.verify(auth.split(' ')[1], JWT_SECRET);
      req.admin = ADMIN;
      next();
    } catch { res.status(401).json({ message: 'Invalid token' }); }
  };

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN.email && password === ADMIN.password) {
      const token = jwt.sign({ id: ADMIN._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, admin: { id: ADMIN._id, name: ADMIN.name, email: ADMIN.email, role: ADMIN.role } });
    }
    res.status(401).json({ message: 'Invalid email or password' });
  });

  app.get('/api/auth/me', authMiddleware, (req, res) => {
    res.json({ admin: { id: ADMIN._id, name: ADMIN.name, email: ADMIN.email, role: ADMIN.role } });
  });

  // ── Products ───────────────────────────────────────────────────────
  app.get('/api/products', authMiddleware, (req, res) => res.json({ products: db.products, total: db.products.length }));
  app.post('/api/products', authMiddleware, (req, res) => {
    const p = { _id: newId(), images: [], ...req.body, stock: Number(req.body.stock || 0), price: Number(req.body.price || 0), mrp: Number(req.body.mrp || 0) };
    db.products.unshift(p);
    res.status(201).json(p);
  });
  app.put('/api/products/:id', authMiddleware, (req, res) => {
    const i = db.products.findIndex(p => p._id === req.params.id);
    if (i === -1) return res.status(404).json({ message: 'Not found' });
    db.products[i] = { ...db.products[i], ...req.body };
    res.json(db.products[i]);
  });
  app.delete('/api/products/:id', authMiddleware, (req, res) => {
    db.products = db.products.filter(p => p._id !== req.params.id);
    res.json({ message: 'Deleted' });
  });

  // ── Categories ─────────────────────────────────────────────────────
  app.get('/api/categories', authMiddleware, (req, res) => res.json(db.categories));
  app.post('/api/categories', authMiddleware, (req, res) => {
    const c = { _id: newId(), isActive: true, ...req.body };
    db.categories.unshift(c);
    res.status(201).json(c);
  });
  app.put('/api/categories/:id', authMiddleware, (req, res) => {
    const i = db.categories.findIndex(c => c._id === req.params.id);
    if (i === -1) return res.status(404).json({ message: 'Not found' });
    db.categories[i] = { ...db.categories[i], ...req.body };
    res.json(db.categories[i]);
  });
  app.delete('/api/categories/:id', authMiddleware, (req, res) => {
    db.categories = db.categories.filter(c => c._id !== req.params.id);
    res.json({ message: 'Deleted' });
  });

  // ── Orders ─────────────────────────────────────────────────────────
  app.get('/api/orders', authMiddleware, (req, res) => {
    let orders = [...db.orders];
    const { status, search } = req.query;
    if (status && status !== 'All') orders = orders.filter(o => o.orderStatus === status);
    if (search) orders = orders.filter(o => o.orderNumber.includes(search) || o.customerName.toLowerCase().includes(search.toLowerCase()));
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    res.json({ orders: orders.slice((page - 1) * limit, page * limit), total: orders.length });
  });
  app.put('/api/orders/:id/status', authMiddleware, (req, res) => {
    const o = db.orders.find(o => o._id === req.params.id);
    if (!o) return res.status(404).json({ message: 'Not found' });
    if (req.body.orderStatus) o.orderStatus = req.body.orderStatus;
    if (req.body.paymentStatus) o.paymentStatus = req.body.paymentStatus;
    res.json(o);
  });

  // ── Users ──────────────────────────────────────────────────────────
  app.get('/api/users', authMiddleware, (req, res) => res.json(db.users));
  app.put('/api/users/:id/block', authMiddleware, (req, res) => {
    const u = db.users.find(u => u._id === req.params.id);
    if (!u) return res.status(404).json({ message: 'Not found' });
    u.isBlocked = req.body.isBlocked;
    res.json(u);
  });

  // ── Coupons ────────────────────────────────────────────────────────
  app.get('/api/coupons', authMiddleware, (req, res) => res.json(db.coupons));
  app.post('/api/coupons', authMiddleware, (req, res) => {
    const c = { _id: newId(), usedCount: 0, isActive: true, ...req.body, discountValue: Number(req.body.discountValue || 0) };
    db.coupons.unshift(c);
    res.status(201).json(c);
  });
  app.put('/api/coupons/:id', authMiddleware, (req, res) => {
    const i = db.coupons.findIndex(c => c._id === req.params.id);
    if (i === -1) return res.status(404).json({ message: 'Not found' });
    db.coupons[i] = { ...db.coupons[i], ...req.body };
    res.json(db.coupons[i]);
  });
  app.delete('/api/coupons/:id', authMiddleware, (req, res) => {
    db.coupons = db.coupons.filter(c => c._id !== req.params.id);
    res.json({ message: 'Deleted' });
  });

  // ── Banners ────────────────────────────────────────────────────────
  app.get('/api/banners', authMiddleware, (req, res) => res.json(db.banners));
  app.post('/api/banners', authMiddleware, (req, res) => {
    const b = { _id: newId(), imageUrl: '', isActive: true, order: db.banners.length + 1, ...req.body };
    db.banners.push(b);
    res.status(201).json(b);
  });
  app.put('/api/banners/:id', authMiddleware, (req, res) => {
    const i = db.banners.findIndex(b => b._id === req.params.id);
    if (i === -1) return res.status(404).json({ message: 'Not found' });
    db.banners[i] = { ...db.banners[i], ...req.body };
    res.json(db.banners[i]);
  });
  app.delete('/api/banners/:id', authMiddleware, (req, res) => {
    db.banners = db.banners.filter(b => b._id !== req.params.id);
    res.json({ message: 'Deleted' });
  });

  // ── Analytics ──────────────────────────────────────────────────────
  app.get('/api/analytics/summary', authMiddleware, (req, res) => {
    res.json({
      totalRevenue: 18450,
      totalOrders: db.orders.length,
      totalUsers: db.users.length,
      totalProducts: db.products.length,
      revenueChange: 12.4,
      ordersChange: 8.1,
      usersChange: 5.3,
    });
  });
  app.get('/api/analytics/chart', authMiddleware, (req, res) => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return { date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), revenue: Math.floor(1500 + Math.random() * 3000), orders: Math.floor(5 + Math.random() * 20) };
    });
    res.json(days);
  });

} else {
  // ── Production mode with MongoDB ───────────────────────────────────
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err.message));

  app.use('/api/auth',       require('./routes/auth'));
  app.use('/api/products',   require('./routes/products'));
  app.use('/api/categories', require('./routes/categories'));
  app.use('/api/orders',     require('./routes/orders'));
  app.use('/api/users',      require('./routes/users'));
  app.use('/api/coupons',    require('./routes/coupons'));
  app.use('/api/banners',    require('./routes/banners'));
  app.use('/api/analytics',  require('./routes/analytics'));
}

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT} [${DEMO_MODE ? 'DEMO' : 'PRODUCTION'} MODE]`));
