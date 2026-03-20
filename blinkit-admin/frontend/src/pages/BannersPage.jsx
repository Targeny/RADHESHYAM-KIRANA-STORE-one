import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import './BannersPage.css';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const defaultForm = { title: '', linkTo: '', isActive: true };

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef();

  const fetchBanners = async () => {
    try {
      const res = await api.get('/banners');
      setBanners(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({ title: b.title || '', linkTo: b.linkTo || '', isActive: b.isActive });
    setImageFile(null);
    setImagePreview(b.imageUrl ? `${BASE_URL}${b.imageUrl}` : null);
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('linkTo', form.linkTo);
      formData.append('isActive', form.isActive);
      if (imageFile) formData.append('image', imageFile);

      if (editing) {
        await api.put(`/banners/${editing._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/banners', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      await fetchBanners();
      closeModal();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/banners/${id}`);
      setDeleteId(null);
      await fetchBanners();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (b) => {
    try {
      await api.put(`/banners/${b._id}`, { isActive: !b.isActive });
      await fetchBanners();
    } catch (e) {
      console.error(e);
    }
  };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="banners-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Banners</h1>
          <p className="page-subtitle">{banners.length} homepage banners</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Banner</button>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /></div>
      ) : (
        <div className="banners-list">
          {banners.map((b, idx) => (
            <div key={b._id} className={`banner-item ${!b.isActive ? 'dim' : ''}`}>
              <div className="banner-order">#{idx + 1}</div>
              <div className="banner-image-wrap">
                {b.imageUrl ? (
                  <img src={`${BASE_URL}${b.imageUrl}`} alt={b.title} className="banner-thumb" />
                ) : (
                  <div className="banner-placeholder">🖼️</div>
                )}
              </div>
              <div className="banner-info">
                <h3>{b.title || 'Untitled Banner'}</h3>
                {b.linkTo && <p className="banner-link">🔗 {b.linkTo}</p>}
              </div>
              <div className="banner-status">
                <span className={`status-badge ${b.isActive ? 'active' : 'inactive'}`}>
                  {b.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <div className="banner-actions">
                <button className="icon-btn toggle" onClick={() => handleToggle(b)}>
                  {b.isActive ? '⏸' : '▶'}
                </button>
                <button className="icon-btn edit" onClick={() => openEdit(b)}>✏️</button>
                <button className="icon-btn delete" onClick={() => setDeleteId(b._id)}>🗑️</button>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="empty-state">No banners yet. Add your first homepage banner!</div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Banner' : 'Add Banner'}>
        <div className="modal-form">
          {/* Image Upload */}
          <div className="form-group">
            <label>Banner Image</label>
            <div
              className="image-upload-zone"
              onClick={() => fileRef.current.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="image-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📁</span>
                  <p>Click to upload banner image</p>
                  <p className="upload-hint">Recommended: 1200×400px</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g. Weekend Mega Sale"
              value={form.title}
              onChange={e => setField('title', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Link To (URL or route)</label>
            <input
              type="text"
              placeholder="e.g. /offers or https://..."
              value={form.linkTo}
              onChange={e => setField('linkTo', e.target.value)}
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
              {saving ? 'Uploading...' : editing ? 'Update' : 'Upload'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Banner">
        <div className="modal-form">
          <p className="confirm-text">Delete this banner permanently?</p>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
