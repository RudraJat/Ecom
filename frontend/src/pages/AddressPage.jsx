import { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Edit2, CheckCircle, AlertCircle, Star } from 'lucide-react';
import api from '../utils/api';
import AccountLayout from '../components/AccountLayout';

const emptyForm = {
  label: 'Home',
  fullName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  isDefault: false,
};

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await api().get('/api/users/profile');
      setAddresses(data.addresses || []);
    } catch (err) {
      setErrorMsg('Could not load addresses.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 3500);
  };

  const openAdd = () => {
    setEditingAddress(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (addr) => {
    setEditingAddress(addr._id);
    setForm({
      label: addr.label || 'Home',
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      address: addr.address || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'India',
      isDefault: addr.isDefault || false,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      let data;
      if (editingAddress) {
        const res = await api().put(`/api/users/addresses/${editingAddress}`, form);
        data = res.data;
      } else {
        const res = await api().post('/api/users/addresses', form);
        data = res.data;
      }
      setAddresses(data);
      setShowModal(false);
      showSuccess(editingAddress ? 'Address updated!' : 'Address added!');
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to save address. Please try again.';
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Remove this address?')) return;
    try {
      const { data } = await api().delete(`/api/users/addresses/${addressId}`);
      setAddresses(data);
      showSuccess('Address removed.');
    } catch (err) {
      showError('Failed to remove address.');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const addr = addresses.find((a) => a._id === addressId);
      const { data } = await api().put(`/api/users/addresses/${addressId}`, {
        ...addr,
        isDefault: true,
      });
      setAddresses(data);
      showSuccess('Default address updated.');
    } catch (err) {
      showError('Failed to update.');
    }
  };

  return (
    <AccountLayout>
      <h1 className="account-section-title">Address Management</h1>
      <p className="account-section-subtitle">Save and manage your delivery addresses.</p>

      {successMsg && (
        <div className="account-alert success">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="account-alert error">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>Loading addresses...</div>
      ) : (
        <div className="address-grid">
          {addresses.map((addr) => (
            <div key={addr._id} className={`address-card${addr.isDefault ? ' default' : ''}`}>
              <div className="address-label">
                <MapPin size={12} />
                {addr.label || 'Address'}
                {addr.isDefault && <span className="address-default-badge">Default</span>}
              </div>
              <div className="address-name">{addr.fullName}</div>
              <div className="address-text">
                {addr.address}<br />
                {addr.city}, {addr.state} — {addr.postalCode}<br />
                {addr.country}<br />
                <span style={{ marginTop: 4, display: 'inline-block' }}>📞 {addr.phone}</span>
              </div>
              <div className="address-actions">
                <button className="address-action-btn" onClick={() => openEdit(addr)}>
                  <Edit2 size={12} style={{ marginRight: 4 }} /> Edit
                </button>
                {!addr.isDefault && (
                  <button className="address-action-btn" onClick={() => handleSetDefault(addr._id)}>
                    <Star size={12} style={{ marginRight: 4 }} /> Set Default
                  </button>
                )}
                <button className="address-action-btn danger" onClick={() => handleDelete(addr._id)}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <button className="add-address-card" onClick={openAdd}>
            <Plus size={22} />
            Add New Address
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="account-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="account-modal" onClick={(e) => e.stopPropagation()}>
            <div className="account-modal-header">
              <div className="account-modal-title">{editingAddress ? 'Edit Address' : 'Add New Address'}</div>
              <button className="account-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              {/* Label selector */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {['Home', 'Work', 'Other'].map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setForm({ ...form, label: lbl })}
                    style={{
                      padding: '7px 18px',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                      border: '1px solid',
                      borderColor: form.label === lbl ? 'rgba(255,255,255,0.4)' : 'var(--border-color)',
                      background: form.label === lbl ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: form.label === lbl ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-main)',
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="account-input-group">
                    <label>Full Name *</label>
                    <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                  </div>
                  <div className="account-input-group">
                    <label>Phone Number *</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                </div>

                <div className="account-input-group">
                  <label>Street Address *</label>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Flat, Building, Street" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="account-input-group">
                    <label>City *</label>
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                  </div>
                  <div className="account-input-group">
                    <label>State *</label>
                    <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="account-input-group">
                    <label>PIN Code *</label>
                    <input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
                  </div>
                  <div className="account-input-group">
                    <label>Country</label>
                    <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: 'white' }}
                  />
                  Set as default delivery address
                </label>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginTop: 20 }}
                disabled={saving}
              >
                {saving ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default AddressPage;
