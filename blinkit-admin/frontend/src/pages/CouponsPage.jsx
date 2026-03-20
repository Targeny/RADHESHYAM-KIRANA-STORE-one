import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import './CouponsPage.css';

const defaultForm = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  maxDiscount: '',
  minOrderValue: '',
  expiryDate: '',
  usageLimit: '',
  isActive: true,
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      maxDiscount: c.maxDiscount || '',
      minOrderValue: c.minOrderValue || '',
      expiryDate: c.expiryDate ? c.expiryDate.split('T')[0] : '',
      usageLimit: c.usageLimit || '',
      isActive: c.isActive,
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.code || !form.discountValue) return;
    setSaving(true);
    try {
      const payload = { ...form };
      if (editing) {
        await api.put(`/coupons/${editing._id}`, payload);
      } else {
        await api.post('/coupons', payload);
      }
      await fetchCoupons();
      closeModal();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      setDeleteId(null);
      await fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (c) => {
    try {
      await api.put(`/coupons/${c._id}`, { isActive: !c.isActive });
      await fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  const isExpired = (date) => date && new Date(date) < new Date();

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="coupons-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Coupons</h1>
          <p className="page-subtitle">{coupons.length} discount coupons</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Create Coupon</button>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /></div>
      ) : (
        <div className="coupons-grid">
          {coupons.map(c => {
            const expired = isExpired(c.expiryDate);
            return (
              <div key={c._id} className={`coupon-card ${!c.isActive || expired ? 'dim' : ''}`}>
                <div className="coupon-left">
                  <div className="coupon-code">{c.code}</div>
                  <div className="coupon-value">
                    {c.discountType === 'percentage'
                      ? `${c.discountValue}% OFF`
                      : `₹${c.discountValue} OFF`}
                  </div>
                  {c.minOrderValue > 0 && (
                    <p className="coupon-meta">Min order: ₹{c.minOrderValue}</p>
                  )}
                  {c.maxDiscount > 0 && c.discountType === 'percentage' && (
                    <p className="coupon-meta">Max: ₹{c.maxDiscount}</p>
                  )}
                </div>
                <div className="coupon-right">
                  <div className="coupon-badges">
                    {expired ? (
                      <span className="badge badge-expired">Expired</span>
                    ) : (
                      <span className={`badge ${c.isActive ? 'badge-active' : 'badge-inactive'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </div>
                  <p className="coupon-usage">Used: {c.usedCount || 0}/{c.usageLimit || '∞'}</p>
                  {c.expiryDate && (
                    <p className="coupon-expiry">
                      Expires: {new Date(c.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                  <div className="coupon-actions">
                    {!expired && (
                      <button className="icon-btn toggle" onClick={() => handleToggle(c)}>
                        {c.isActive ? '⏸' : '▶'}
                      </button>
                    )}
                    <button className="icon-btn edit" onClick={() => openEdit(c)}>✏️</button>
                    <button className="icon-btn delete" onClick={() => setDeleteId(c._id)}>🗑️</button>
                  </div>
                </div>
              </div>
            );
          })}
          {coupons.length === 0 && (
            <div className="empty-state">No coupons yet. Create your first one!</div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Coupon' : 'Create Coupon'}>
        <div className="modal-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>Coupon Code *</label>
              <input
                type="text"
                placeholder="e.g. SAVE20"
                value={form.code}
                onChange={e => setField('code', e.target.value.toUpperCase())}
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.discountType} onChange={e => setField('discountType', e.target.value)}>
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Discount Value *</label>
              <input
                type="number"
                placeholder={form.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 50'}
                value={form.discountValue}
                onChange={e => setField('discountValue', e.target.value)}
              />
            </div>
            {form.discountType === 'percentage' && (
              <div className="form-group">
                <label>Max Discount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={form.maxDiscount}
                  onChange={e => setField('maxDiscount', e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Min Order Value (₹)</label>
              <input
                type="number"
                placeholder="e.g. 200"
                value={form.minOrderValue}
                onChange={e => setField('minOrderValue', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Usage Limit</label>
              <input
                type="number"
                placeholder="Leave blank for unlimited"
                value={form.usageLimit}
                onChange={e => setField('usageLimit', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={e => setField('expiryDate', e.target.value)}
            />
          </div>

          <div className="form-group form-row">
            <label>Active</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setField('isActive', e.target.checked)}
              />
              <span className="toggle-thumb" />
            </label>
          </div>

          <div className="modal-actions">
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Coupon">
        <div className="modal-form">
          <p className="confirm-text">Delete this coupon permanently?</p>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
