import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';

const ORDER_STATUSES = ['All', 'Received', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];
const STATUS_COLORS = { Received: 'badge-info', Packed: 'badge-warning', 'Out for Delivery': 'badge-warning', Delivered: 'badge-success', Cancelled: 'badge-danger' };
const PAY_COLORS = { Paid: 'badge-success', Pending: 'badge-warning', Failed: 'badge-danger', Refunded: 'badge-gray' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const LIMIT = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT, status });
      if (search) params.append('search', search);
      const { data } = await api.get(`/orders?${params}`);
      setOrders(data.orders); setTotal(data.total);
    } finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, orderStatus, paymentStatus) => {
    await api.put(`/orders/${id}/status`, { orderStatus, paymentStatus });
    load();
    setSelected(prev => prev ? { ...prev, orderStatus: orderStatus || prev.orderStatus, paymentStatus: paymentStatus || prev.paymentStatus } : null);
  };

  const pages = Math.ceil(total / LIMIT);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-header">
        <div><h2 className="page-title">Orders</h2><p className="page-subtitle">{total} total orders</p></div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search by order# or customer..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ORDER_STATUSES.map(s => (
              <button key={s} className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { setStatus(s); setPage(1); }}>{s}</button>
            ))}
          </div>
        </div>

        {loading ? <div className="spinner" /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {orders.length === 0 && <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">🛒</div><p>No orders found</p></div></td></tr>}
                {orders.map(o => (
                  <tr key={o._id}>
                    <td><strong style={{ fontFamily: 'monospace', fontSize: 12 }}>{o.orderNumber}</strong></td>
                    <td><div><strong>{o.customerName}</strong><br /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.customerPhone}</span></div></td>
                    <td>{o.items.length} item{o.items.length > 1 ? 's' : ''}</td>
                    <td><strong>₹{o.totalAmount}</strong><br /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.paymentMethod}</span></td>
                    <td><span className={`badge ${PAY_COLORS[o.paymentStatus]}`}>{o.paymentStatus}</span></td>
                    <td><span className={`badge ${STATUS_COLORS[o.orderStatus]}`}>{o.orderStatus}</span></td>
                    <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(o)}>View →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="pagination" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 14 }}>
            <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Page {page} of {pages}</span>
            <button className="btn btn-outline btn-sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Order ${selected?.orderNumber}`} size="lg">
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><p style={{ fontSize: 11, color: 'var(--text-muted)' }}>CUSTOMER</p><p style={{ fontWeight: 600 }}>{selected.customerName}</p><p style={{ fontSize: 12 }}>{selected.customerPhone}</p></div>
              <div><p style={{ fontSize: 11, color: 'var(--text-muted)' }}>ADDRESS</p><p style={{ fontSize: 12 }}>{selected.address?.line1}, {selected.address?.city} - {selected.address?.pincode}</p></div>
            </div>
            <table style={{ marginBottom: 16 }}>
              <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
              <tbody>
                {selected.items.map((item, i) => (
                  <tr key={i}><td>{item.name}</td><td>{item.quantity}</td><td>₹{item.price * item.quantity}</td></tr>
                ))}
                <tr><td colSpan={2} style={{ fontWeight: 700 }}>Total</td><td style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{selected.totalAmount}</td></tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>Order Status</label>
                <select className="form-control" value={selected.orderStatus}
                  onChange={e => updateStatus(selected._id, e.target.value, null)}>
                  {ORDER_STATUSES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>Payment Status</label>
                <select className="form-control" value={selected.paymentStatus}
                  onChange={e => updateStatus(selected._id, null, e.target.value)}>
                  {['Pending', 'Paid', 'Failed', 'Refunded'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
