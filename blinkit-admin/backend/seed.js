require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');
const Coupon = require('./models/Coupon');
const Banner = require('./models/Banner');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  await Promise.all([
    Admin.deleteMany(), Category.deleteMany(), Product.deleteMany(),
    Order.deleteMany(), User.deleteMany(), Coupon.deleteMany(), Banner.deleteMany(),
  ]);
  console.log('🗑️  Cleared all collections');

  await Admin.create({ name: 'Admin', email: 'admin@blinkit.com', password: 'Admin@123', role: 'admin' });
  console.log('✅ Admin: admin@blinkit.com / Admin@123');

  const cats = await Category.insertMany([
    { name: 'Dairy, Bread & Eggs', icon: '🥛', order: 1 },
    { name: 'Fruits & Vegetables', icon: '🥦', order: 2 },
    { name: 'Snacks & Munchies', icon: '🍿', order: 3 },
    { name: 'Cold Drinks & Juices', icon: '🥤', order: 4 },
    { name: 'Breakfast & Cereals', icon: '🥣', order: 5 },
  ]);

  const products = await Product.insertMany([
    { name: 'Amul Taaza Milk', price: 27, mrp: 28, discount: 3, category: cats[0]._id, stock: 100, unit: '500ml', tags: ['Bestseller'], rating: 4.5 },
    { name: 'Harvest Gold Bread', price: 40, mrp: 45, discount: 11, category: cats[0]._id, stock: 50, unit: '400g', rating: 4.2 },
    { name: 'Fresh Bananas', price: 32, category: cats[1]._id, stock: 80, unit: '500g', rating: 4.4 },
    { name: 'Red Apples (Shimla)', price: 120, mrp: 145, discount: 17, category: cats[1]._id, stock: 60, unit: '500g', tags: ['Trending'], rating: 4.5 },
    { name: "Lay's Magic Masala", price: 20, category: cats[2]._id, stock: 200, unit: '50g', tags: ['Bestseller'], rating: 4.6 },
    { name: 'Pringles Original', price: 199, mrp: 249, discount: 20, category: cats[2]._id, stock: 40, unit: '165g', tags: ['Sale'], rating: 4.4 },
    { name: 'Coca-Cola 750ml', price: 40, category: cats[3]._id, stock: 150, tags: ['Trending'], rating: 4.4 },
    { name: 'Tropicana Orange 1L', price: 110, mrp: 130, discount: 15, category: cats[3]._id, stock: 70, rating: 4.3 },
    { name: "Kellogg's Corn Flakes", price: 238, mrp: 280, discount: 15, category: cats[4]._id, stock: 35, rating: 4.4 },
    { name: 'Quaker Oats 400g', price: 155, mrp: 175, discount: 11, category: cats[4]._id, stock: 45, rating: 4.5 },
  ]);
  console.log('✅ 10 products created');

  const users = await User.insertMany([
    { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', totalOrders: 5, totalSpent: 1250 },
    { name: 'Priya Patel', email: 'priya@example.com', phone: '9876543211', totalOrders: 3, totalSpent: 870 },
    { name: 'Amit Kumar', email: 'amit@example.com', phone: '9876543212', totalOrders: 8, totalSpent: 3200 },
  ]);
  console.log('✅ 3 users created');

  const statuses = ['Received', 'Packed', 'Out for Delivery', 'Delivered', 'Delivered', 'Cancelled', 'Delivered', 'Packed', 'Received', 'Delivered'];
  for (let i = 0; i < 10; i++) {
    const user = users[i % 3];
    const p1 = products[i % products.length];
    const p2 = products[(i + 2) % products.length];
    const subtotal = p1.price * 2 + p2.price;
    await Order.create({
      user: user._id, customerName: user.name, customerPhone: user.phone,
      items: [
        { product: p1._id, name: p1.name, price: p1.price, quantity: 2 },
        { product: p2._id, name: p2.name, price: p2.price, quantity: 1 },
      ],
      subtotal, totalAmount: subtotal,
      paymentMethod: ['COD', 'Online', 'UPI'][i % 3],
      paymentStatus: i < 7 ? 'Paid' : 'Pending',
      orderStatus: statuses[i],
      address: { line1: `${100 + i} Main Street`, city: 'Delhi', pincode: `11000${i}` },
    });
  }
  console.log('✅ 10 sample orders created');

  await Coupon.insertMany([
    { code: 'WELCOME20', discountType: 'percentage', discountValue: 20, maxDiscount: 100, minOrderValue: 199, expiryDate: new Date(Date.now() + 30 * 86400000), description: 'New user 20% off' },
    { code: 'FLAT50', discountType: 'flat', discountValue: 50, minOrderValue: 299, expiryDate: new Date(Date.now() + 15 * 86400000), description: 'Flat ₹50 off' },
  ]);
  console.log('✅ 2 coupons created');

  await Banner.insertMany([
    { title: 'Fresh Groceries Daily', subtitle: 'Delivered in 10 minutes', imageUrl: '', linkTo: '/', bgColor: '#fef3c7', order: 1 },
    { title: 'Snacks for Every Craving', subtitle: 'Chips, chocolates & more', imageUrl: '', linkTo: '/', bgColor: '#dbeafe', order: 2 },
  ]);
  console.log('✅ 2 banners created');

  console.log('\n🎉 Seed complete! Login: admin@blinkit.com / Admin@123');
  await mongoose.connection.close();
}

seed().catch(err => { console.error(err); process.exit(1); });
