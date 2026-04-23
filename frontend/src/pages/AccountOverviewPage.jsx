import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, MapPin, CreditCard, CheckCircle, AlertCircle, Edit2 } from 'lucide-react';
import api from '../utils/api';
import AccountLayout from '../components/AccountLayout';
import { useAuth } from '../context/AuthContext';

const AccountOverviewPage = () => {
  const { userInfo, updateProfile, loading, error } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api().get('/api/users/profile');
      setProfile(data);
      setForm({ name: data.name, email: data.email, phone: data.phone || '' });
    } catch (err) {
      setLocalError('Failed to load profile.');
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api().get('/api/orders/myorders');
      setOrders(data);
    } catch (err) {
      // silently fail for orders
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setLocalError('');
    const result = await updateProfile(form);
    if (result.success) {
      setSuccessMsg('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } else {
      setLocalError(error || 'Update failed. Please try again.');
    }
  };

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : '—';

  return (
    <AccountLayout>
      <h1 className="account-section-title">Account Overview</h1>
      <p className="account-section-subtitle">Manage your personal information and see a summary of your account.</p>

      {/* Stats */}
      <div className="account-stats-grid">
        <div className="account-stat-card">
          <div className="account-stat-value">{orders.length}</div>
          <div className="account-stat-label">Total Orders</div>
        </div>
        <div className="account-stat-card">
          <div className="account-stat-value">{profile?.wishlist?.length || 0}</div>
          <div className="account-stat-label">Wishlisted</div>
        </div>
        <div className="account-stat-card">
          <div className="account-stat-value">{profile?.addresses?.length || 0}</div>
          <div className="account-stat-label">Addresses</div>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="account-alert success">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}
      {localError && (
        <div className="account-alert error">
          <AlertCircle size={18} /> {localError}
        </div>
      )}

      {/* Profile Card */}
      <div className="account-card">
        <div className="account-card-title">
          Personal Information
          <button
            className="btn-outline"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            onClick={() => setEditing(!editing)}
          >
            <Edit2 size={14} style={{ marginRight: 6 }} />
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSave}>
            <div className="account-form-grid">
              <div className="account-input-group">
                <label>Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="account-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="account-input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
            <div className="account-save-btn">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="account-form-grid">
            <div className="account-input-group">
              <label>Full Name</label>
              <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, fontSize: '0.9rem' }}>
                {profile?.name || userInfo?.name}
              </div>
            </div>
            <div className="account-input-group">
              <label>Email Address</label>
              <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, fontSize: '0.9rem' }}>
                {profile?.email || userInfo?.email}
              </div>
            </div>
            <div className="account-input-group">
              <label>Phone Number</label>
              <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, fontSize: '0.9rem', color: profile?.phone ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {profile?.phone || 'Not provided'}
              </div>
            </div>
            <div className="account-input-group">
              <label>Member Since</label>
              <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, fontSize: '0.9rem' }}>
                {memberSince}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="account-card">
        <div className="account-card-title">Quick Access</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { label: 'View Orders', icon: ShoppingBag, path: '/account/orders', sub: `${orders.length} orders` },
            { label: 'Wishlist', icon: Heart, path: '/account/wishlist', sub: `${profile?.wishlist?.length || 0} items` },
            { label: 'Addresses', icon: MapPin, path: '/account/addresses', sub: `${profile?.addresses?.length || 0} saved` },
            { label: 'Payments', icon: CreditCard, path: '/account/payments', sub: 'Manage cards' },
          ].map(({ label, icon: Icon, path, sub }) => (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 14,
                border: '1px solid var(--border-color)',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div className="account-nav-icon">
                <Icon size={16} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
};

export default AccountOverviewPage;
