import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import './ProductsPage.css';

const TAGS = ['Bestseller', 'New', 'Trending', 'Sale', 'Featured'];
const EMPTY = { name: '', price: '', mrp: '', discount: '', stock: '', unit: '', description: '', category: '', tags: [], isAvailable: true };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const LIMIT = 15;

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.append('search', search);
      if (catFilter) params.append('category', catFilter);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
    } finally { setLoading(false); }
  }, [page, search, catFilter]);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data));
  }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal('form'); setMsg(''); };
  const openEdit = (p) => {
    setForm({ ...p, category: p.category?._id || '', price: p.price, mrp: p.mrp || '', discount: p.discount || '', stock: p.stock });
    setEditing(p._id); setModal('form'); setMsg('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      const fd = new FormData();
      const { imageFile, ...rest } = form;
      fd.append('data', JSON.stringify(rest));
      if (imageFile) fd.append('images', imageFile);
      if (editing) {
        await api.put(`/products/${editing}`, fd);
        setMsg('Product updated!');
      } else {
        await api.post('/products', fd);
        setMsg('Product added!');
      }
      loadProducts();
      setTimeout(() => setModal(null), 800);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const handleToggle = async (p) => {
    await api.patch(`/products/${p._id}/toggle`);
    setProducts(prev => prev.map(x => x._id === p._id ? { ...x, isAvailable: !x.isAvailable } : x));
  };

  const toggleTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));
  };

  const pages = Math.ceil(total / LIMIT);

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Products</h2>
          <p className="page-subtitle">{total} products in catalog</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="card">
        <div className="filters-row">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search products..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="form-control filter-select" value={catFilter}
            onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
          </select>
        </div>

        {loading ? <div className="spinner" /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th><th>Category</th><th>Price</th>
                  <th>Stock</th><th>Tags</th><th>Available</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr><td colSpan={7}><div className="empty-state"><div className="empty-icon">📦</div><p>No products found</p></div></td></tr>
                )}
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-name-cell">
                        <strong>{p.name}</strong>
                        <span className="product-unit">{p.unit}</span>
                      </div>
                    </td>
                    <td>{p.category?.icon} {p.category?.name || '—'}</td>
                    <td>
                      <div className="price-cell">
                        <strong>₹{p.price}</strong>
                        {p.mrp && <span className="mrp">₹{p.mrp}</span>}
                        {p.discount > 0 && <span className="badge badge-success">{p.discount}% off</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                        {p.stock > 0 ? `${p.stock} left` : 'Out'}
                      </span>
                    </td>
                    <td>
                      <div className="tags-cell">
                        {p.tags?.map(t => <span key={t} className="badge badge-info">{t}</span>)}
                      </div>
                    </td>
                    <td>
                      <label className="switch">
                        <input type="checkbox" checked={p.isAvailable} onChange={() => handleToggle(p)} />
                        <span className="slider" />
                      </label>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(p._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="pagination">
            <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span className="page-info">Page {page} of {pages}</span>
            <button className="btn btn-outline btn-sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      <Modal isOpen={modal === 'form'} onClose={() => setModal(null)} title={editing ? 'Edit Product' : 'Add Product'} size="lg">
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Product Name *</label>
              <input className="form-control" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Amul Butter 500g" />
            </div>
            <div className="form-group">
              <label>Price (₹) *</label>
              <input className="form-control" type="number" required value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>MRP (₹)</label>
              <input className="form-control" type="number" value={form.mrp}
                onChange={e => setForm(f => ({ ...f, mrp: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input className="form-control" type="number" min="0" max="100" value={form.discount}
                onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input className="form-control" type="number" min="0" value={form.stock}
                onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <input className="form-control" value={form.unit}
                onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="e.g. 500g" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="form-control" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Description</label>
              <textarea className="form-control" rows={2} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Tags</label>
              <div className="tags-picker">
                {TAGS.map(t => (
                  <button type="button" key={t}
                    className={`tag-chip ${form.tags?.includes(t) ? 'active' : ''}`}
                    onClick={() => toggleTag(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Upload Image</label>
              <input type="file" accept="image/*"
                onChange={e => setForm(f => ({ ...f, imageFile: e.target.files[0] }))} />
            </div>
          </div>
          {msg && <p style={{ color: msg.includes('!') ? 'var(--success)' : 'var(--danger)', fontSize: 13, margin: '8px 0' }}>{msg}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Add Product'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
