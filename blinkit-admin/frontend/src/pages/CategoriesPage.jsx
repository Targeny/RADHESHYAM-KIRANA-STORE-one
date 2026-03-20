import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import './CategoriesPage.css';

const ICONS = ['🥦', '🥛', '🍎', '🍗', '🍚', '🧁', '🧴', '🧹', '💊', '🐾', '🥤', '🍳', '🛒', '❄️', '🌿'];

const defaultForm = { name: '', icon: '🛒', isActive: true };

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, icon: cat.icon || '🛒', isActive: cat.isActive });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing._id}`, form);
      } else {
        await api.post('/categories', form);
      }
      await fetchCategories();
      closeModal();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setDeleteId(null);
      await fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (cat) => {
    try {
      await api.put(`/categories/${cat._id}`, { isActive: !cat.isActive });
      await fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="categories-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">{categories.length} total categories</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Category</button>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /></div>
      ) : (
        <div className="categories-grid">
          {filtered.map(cat => (
            <div key={cat._id} className={`category-card ${!cat.isActive ? 'inactive' : ''}`}>
              <div className="cat-icon">{cat.icon || '🛒'}</div>
              <div className="cat-info">
                <h3>{cat.name}</h3>
                <span className={`status-badge ${cat.isActive ? 'active' : 'inactive'}`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="cat-actions">
                <button className="icon-btn toggle" onClick={() => handleToggle(cat)} title="Toggle status">
                  {cat.isActive ? '⏸' : '▶'}
                </button>
                <button className="icon-btn edit" onClick={() => openEdit(cat)} title="Edit">✏️</button>
                <button className="icon-btn delete" onClick={() => setDeleteId(cat._id)} title="Delete">🗑️</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">No categories found</div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Category' : 'Add Category'}>
        <div className="modal-form">
          <div className="form-group">
            <label>Category Name *</label>
            <input
              type="text"
              placeholder="e.g. Dairy & Eggs"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Icon</label>
            <div className="icon-picker">
              {ICONS.map(ic => (
                <button
                  key={ic}
                  className={`icon-option ${form.icon === ic ? 'selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, icon: ic }))}
                >
                  {ic}
                </button>
              ))}
            </div>
            <p className="selected-icon-preview">Selected: <span>{form.icon}</span></p>
          </div>

          <div className="form-group form-row">
            <label>Active</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
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

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Category">
        <div className="modal-form">
          <p className="confirm-text">Are you sure you want to delete this category? This action cannot be undone.</p>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
