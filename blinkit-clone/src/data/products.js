export const products = [
  // Dairy, Bread & Eggs
  { id: 1, name: 'Amul Taaza Toned Fresh Milk', weight: '500 ml', price: 27, mrp: 28, discount: 3, icon: '🥛', color: '#e3f2fd', category: 'dairy', rating: 4.5, badge: 'Bestseller' },
  { id: 2, name: 'Harvest Gold White Bread', weight: '400 g', price: 40, mrp: 45, discount: 11, icon: '🍞', color: '#fff3e0', category: 'dairy', rating: 4.2 },
  { id: 3, name: 'Amul Butter Unsalted', weight: '500 g', price: 245, mrp: 260, discount: 6, icon: '🧈', color: '#fffde7', category: 'dairy', rating: 4.7, badge: 'Bestseller' },
  { id: 4, name: 'Nandini Fresh Paneer', weight: '200 g', price: 95, mrp: 105, discount: 9, icon: '🧀', color: '#fce4ec', category: 'dairy', rating: 4.3 },
  { id: 5, name: 'Amul Gold Full Cream Milk', weight: '1 L', price: 68, mrp: 72, discount: 5, icon: '🥛', color: '#e8f5e9', category: 'dairy', rating: 4.6 },
  { id: 6, name: 'Heritage Eggs – White', weight: '6 pcs', price: 48, mrp: 54, discount: 11, icon: '🥚', color: '#f3e5f5', category: 'dairy', rating: 4.1 },

  // Fruits & Vegetables
  { id: 7, name: 'Fresh Bananas', weight: '500 g', price: 32, icon: '🍌', color: '#fffde7', category: 'fruits', rating: 4.4 },
  { id: 8, name: 'Red Apples (Shimla)', weight: '500 g', price: 120, mrp: 145, discount: 17, icon: '🍎', color: '#fce4ec', category: 'fruits', rating: 4.5, badge: 'Popular' },
  { id: 9, name: 'Fresh Tomatoes', weight: '500 g', price: 22, icon: '🍅', color: '#ffebee', category: 'fruits', rating: 4.2 },
  { id: 10, name: 'Organic Spinach', weight: '250 g', price: 38, icon: '🥬', color: '#e8f5e9', category: 'fruits', rating: 4.0 },
  { id: 11, name: 'Carrots', weight: '500 g', price: 28, icon: '🥕', color: '#fff3e0', category: 'fruits', rating: 4.3 },
  { id: 12, name: 'Fresh Lemons', weight: '4 pcs', price: 20, icon: '🍋', color: '#fffde7', category: 'fruits', rating: 4.1 },

  // Cold Drinks & Juices
  { id: 13, name: 'Coca-Cola Original Taste', weight: '750 ml', price: 40, icon: '🥤', color: '#ffebee', category: 'drinks', rating: 4.4, badge: 'Popular' },
  { id: 14, name: 'Tropicana Orange Juice', weight: '1 L', price: 110, mrp: 130, discount: 15, icon: '🍊', color: '#fff3e0', category: 'drinks', rating: 4.3 },
  { id: 15, name: 'Red Bull Energy Drink', weight: '250 ml', price: 115, icon: '⚡', color: '#e8f5e9', category: 'drinks', rating: 4.5 },
  { id: 16, name: 'Minute Maid Nimbu Fresh', weight: '400 ml', price: 30, icon: '🍋', color: '#fffde7', category: 'drinks', rating: 4.0 },
  { id: 17, name: 'Paper Boat Aam Panna', weight: '250 ml', price: 25, mrp: 30, discount: 17, icon: '🥭', color: '#fff8e1', category: 'drinks', rating: 4.2 },

  // Snacks & Munchies
  { id: 18, name: "Lay's India's Magic Masala", weight: '50 g', price: 20, icon: '🥔', color: '#fff8e1', category: 'snacks', rating: 4.5, badge: 'Fan Fav' },
  { id: 19, name: 'Haldirams Aloo Bhujia', weight: '200 g', price: 80, mrp: 90, discount: 11, icon: '🌾', color: '#fff3e0', category: 'snacks', rating: 4.6 },
  { id: 20, name: 'Oreo Chocolate Biscuits', weight: '120 g', price: 35, icon: '🍪', color: '#e8eaf6', category: 'snacks', rating: 4.7, badge: 'Bestseller' },
  { id: 21, name: 'Pringles Original', weight: '165 g', price: 199, mrp: 249, discount: 20, icon: '🍿', color: '#ffe0b2', category: 'snacks', rating: 4.4 },
  { id: 22, name: 'Kurkure Masala Munch', weight: '99 g', price: 20, icon: '🌶️', color: '#ffccbc', category: 'snacks', rating: 4.3 },

  // Breakfast & Instant Food
  { id: 23, name: 'Maggi 2-Minute Noodles', weight: '70 g', price: 14, icon: '🍜', color: '#fffde7', category: 'breakfast', rating: 4.8, badge: '🔥 Hot' },
  { id: 24, name: 'Kellogg\'s Corn Flakes Original', weight: '475 g', price: 238, mrp: 280, discount: 15, icon: '🥣', color: '#fff3e0', category: 'breakfast', rating: 4.4 },
  { id: 25, name: 'MTR Poha Anytime', weight: '80 g', price: 28, icon: '🍚', color: '#e8f5e9', category: 'breakfast', rating: 4.2 },
  { id: 26, name: 'Quaker Oats Instant', weight: '400 g', price: 155, mrp: 175, discount: 11, icon: '🌾', color: '#efebe9', category: 'breakfast', rating: 4.5 },

  // Sweet Tooth
  { id: 27, name: 'Cadbury Dairy Milk Silk', weight: '60 g', price: 75, mrp: 85, discount: 12, icon: '🍫', color: '#e8eaf6', category: 'sweets', rating: 4.9, badge: 'Bestseller' },
  { id: 28, name: 'KitKat Chocolate Bar', weight: '38 g', price: 40, icon: '🍬', color: '#fce4ec', category: 'sweets', rating: 4.7 },
  { id: 29, name: 'Haldirams Gulab Jamun', weight: '500 g', price: 130, mrp: 150, discount: 13, icon: '🍮', color: '#fff8e1', category: 'sweets', rating: 4.5 },
  { id: 30, name: 'Ferrero Rocher (3 pcs)', weight: '37.5 g', price: 160, icon: '🎁', color: '#fff3e0', category: 'sweets', rating: 4.8 },

  // Bakery & Biscuits
  { id: 31, name: 'Britannia Bourbon Chocolate', weight: '150 g', price: 30, icon: '🍪', color: '#efebe9', category: 'bakery', rating: 4.6, badge: 'Popular' },
  { id: 32, name: 'Monaco Salted Biscuits', weight: '150 g', price: 25, icon: '🥯', color: '#f3e5f5', category: 'bakery', rating: 4.2 },
  { id: 33, name: 'Parle-G Glucose Biscuits', weight: '250 g', price: 18, icon: '🍘', color: '#e0f2f1', category: 'bakery', rating: 4.7, badge: 'Icon' },
  { id: 34, name: 'Pillsbury Brownie Mix', weight: '450 g', price: 199, mrp: 250, discount: 20, icon: '🎂', color: '#f3e5f5', category: 'bakery', rating: 4.4 },

  // Tea, Coffee & Milk Drinks
  { id: 35, name: 'Tata Tea Gold', weight: '250 g', price: 120, mrp: 140, discount: 14, icon: '🍵', color: '#e0f2f1', category: 'tea', rating: 4.5, badge: 'Bestseller' },
  { id: 36, name: 'Nescafe Classic Instant Coffee', weight: '50 g', price: 135, mrp: 155, discount: 13, icon: '☕', color: '#efebe9', category: 'tea', rating: 4.6 },
  { id: 37, name: 'Bournvita Health Drink', weight: '500 g', price: 275, mrp: 320, discount: 14, icon: '🥛', color: '#fbe9e7', category: 'tea', rating: 4.7 },
  { id: 38, name: 'Horlicks Health Drink', weight: '500 g', price: 280, mrp: 330, discount: 15, icon: '🌾', color: '#fff8e1', category: 'tea', rating: 4.5 },

  // Atta, Rice & Dal
  { id: 39, name: 'Aashirvaad Whole Wheat Atta', weight: '5 kg', price: 249, mrp: 280, discount: 11, icon: '🌾', color: '#fff3e0', category: 'atta', rating: 4.8, badge: 'Bestseller' },
  { id: 40, name: 'India Gate Basmati Rice', weight: '1 kg', price: 140, mrp: 160, discount: 13, icon: '🍚', color: '#e8f5e9', category: 'atta', rating: 4.7 },
  { id: 41, name: 'Tata Sampann Masoor Dal', weight: '500 g', price: 85, mrp: 95, discount: 11, icon: '🫘', color: '#fce4ec', category: 'atta', rating: 4.4 },
  { id: 42, name: 'Fortune Soya Chunks', weight: '200 g', price: 40, icon: '🫛', color: '#e8f5e9', category: 'atta', rating: 4.3 },

  // Paan Corner
  { id: 43, name: 'Rajnigandha Silver Pearls', weight: '4 g', price: 10, icon: '🌿', color: '#e8f5e9', category: 'paan', rating: 4.5 },
  { id: 44, name: 'Pan Bahar Meetha Paan Masala', weight: '10 g', price: 15, icon: '🍃', color: '#f1f8e9', category: 'paan', rating: 4.2 },
  { id: 45, name: 'Manikchand Pan Masala', weight: '7 g', price: 12, icon: '🌱', color: '#e8f5e9', category: 'paan', rating: 4.0 },

  // Farmley Premium California Almonds
  { id: 46, name: 'Farmley Premium California Almonds', weight: '200 g', price: 298, mrp: 499, discount: 40, icon: '🌰', color: '#efebe9', category: 'snacks', rating: 4.6, badge: '40% OFF' },
];

export const getAllProducts = () => products;
export const getFeaturedProducts = () => products.filter(p => p.badge);
export const getProductsByCategory = (catId) => products.filter(p => p.category === catId);
export const searchProducts = (query) => {
  const q = query.toLowerCase();
  return products.filter(p => p.name.toLowerCase().includes(q));
};
