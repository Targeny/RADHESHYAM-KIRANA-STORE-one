import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './OrdersPage.css';

const StatusBadge = ({ status }) => {
  const map = {
    'Delivered': { color: '#0c831f', bg: '#e8f5e9', icon: '✅' },
    'Cancelled': { color: '#e23744', bg: '#ffebee', icon: '❌' },
    'Processing': { color: '#e68000', bg: '#fff3e0', icon: '⏳' },
  };
  const s = map[status] || map['Delivered'];
  return (
    <span className="status-badge" style={{ color: s.color, background: s.bg }}>
      {s.icon} {status}
    </span>
  );
};

const OrdersPage = () => {
  const { orders } = useOrders();
  const { bulkAddToCart } = useCart();
  const { addToast } = useToast();
  const [expanded, setExpanded] = useState(null);

  const handleReorder = (items) => {
    bulkAddToCart(items);
    addToast('🛒 Items added to cart!', 'success');
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (orders.length === 0) {
    return (
      <div className="orders-empty container">
        <div className="orders-empty-inner">
          <span>📦</span>
          <h2>No orders yet</h2>
          <p>Your past orders will appear here once you place one.</p>
          <a href="/" className="browse-link-orders">Start Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page container">
      <h1 className="orders-title">📦 My Orders</h1>
      <p className="orders-subtitle">{orders.length} order{orders.length > 1 ? 's' : ''} placed</p>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
              <div className="order-meta">
                <div className="order-id">Order #{order.id}</div>
                <div className="order-date">{formatDate(order.date)}</div>
              </div>
              <div className="order-right">
                <StatusBadge status={order.status} />
                <span className="order-total">₹{order.total}</span>
                <span className="order-expand">{expanded === order.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expanded === order.id && (
              <div className="order-details">
                <div className="order-items-list">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <div className="order-item-icon" style={{ backgroundColor: item.color }}>{item.icon}</div>
                      <div className="order-item-info">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-meta">{item.weight} · x{item.quantity}</span>
                      </div>
                      <span className="order-item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="order-actions">
                  <button className="reorder-btn" onClick={() => handleReorder(order.items)}>
                    🔁 Reorder
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
