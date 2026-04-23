import { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, CheckCircle, AlertCircle, Shield, Wallet, Star } from 'lucide-react';
import api from '../utils/api';
import AccountLayout from '../components/AccountLayout';

const PaymentsPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const { data } = await api().get('/api/users/profile');
      setCards(data.savedCards || []);
    } catch (err) {
      setErrorMsg('Could not load saved cards.');
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

  const handleSetDefault = async (cardId) => {
    try {
      const { data } = await api().put(`/api/users/cards/${cardId}/default`);
      setCards(data);
      showSuccess('Default card updated.');
    } catch (err) {
      showError('Failed to update default card.');
    }
  };

  const handleRemove = async (cardId) => {
    if (!window.confirm('Remove this card?')) return;
    try {
      const { data } = await api().delete(`/api/users/cards/${cardId}`);
      setCards(data);
      showSuccess('Card removed successfully.');
    } catch (err) {
      showError('Failed to remove card.');
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const rawNum = newCard.number.replace(/\s/g, '');
      const last4 = rawNum.slice(-4);
      const brand = rawNum.startsWith('4') ? 'VISA' : rawNum.startsWith('5') ? 'MC' : rawNum.startsWith('3') ? 'AMEX' : 'CARD';

      const { data } = await api().post('/api/users/cards', {
        last4,
        brand,
        expiry: newCard.expiry,
        isDefault: cards.length === 0,
      });
      setCards(data);
      setNewCard({ number: '', name: '', expiry: '', cvv: '' });
      setShowAddModal(false);
      showSuccess('Card added and saved securely!');
    } catch (err) {
      showError('Failed to save card. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatCardNumber = (val) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned;
  };

  return (
    <AccountLayout>
      <h1 className="account-section-title">Payments & Wallet</h1>
      <p className="account-section-subtitle">Manage your saved payment methods. All data is stored securely.</p>

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

      {/* Security Notice */}
      <div className="account-card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Shield size={18} color="#10b981" />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>Your payment info is stored securely</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Card details (last 4 digits + expiry) are saved to your account in MongoDB. We never store full card numbers or CVVs.
          </div>
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="account-card" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <Wallet size={20} />
          <span style={{ fontWeight: 600 }}>AURA Wallet</span>
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 4 }}>₹0.00</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Available balance</div>
        <button className="btn-outline" style={{ marginTop: 16, padding: '8px 20px', fontSize: '0.85rem' }}>
          Add Money
        </button>
      </div>

      {/* Saved Cards */}
      <div className="account-card">
        <div className="account-card-title">
          Saved Cards ({loading ? '…' : cards.length})
          <button
            className="btn-outline"
            style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={14} /> Add Card
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)' }}>Loading cards...</div>
        ) : cards.length === 0 ? (
          <div className="account-empty" style={{ padding: '32px 0' }}>
            <div className="account-empty-icon" style={{ margin: '0 auto 12px' }}>
              <CreditCard size={22} strokeWidth={1.5} />
            </div>
            <h3>No cards saved yet</h3>
            <p>Add a card to checkout faster next time.</p>
          </div>
        ) : (
          cards.map((card) => (
            <div key={card._id} className="payment-card">
              <div className="payment-card-icon">{card.brand}</div>
              <div className="payment-card-details">
                <div className="payment-card-number">•••• •••• •••• {card.last4}</div>
                <div className="payment-card-expiry">Expires {card.expiry}</div>
              </div>
              {card.isDefault && <div className="payment-card-default">Default</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                {!card.isDefault && (
                  <button className="address-action-btn" onClick={() => handleSetDefault(card._id)}>
                    <Star size={12} style={{ marginRight: 4 }} /> Default
                  </button>
                )}
                <button className="address-action-btn danger" onClick={() => handleRemove(card._id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* UPI Section */}
      <div className="account-card">
        <div className="account-card-title">UPI & Net Banking</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          UPI and net banking options appear automatically at checkout. No pre-registration needed — just choose your method when you place an order.
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="account-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="account-modal" onClick={(e) => e.stopPropagation()}>
            <div className="account-modal-header">
              <div className="account-modal-title">Add New Card</div>
              <button className="account-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddCard}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="account-input-group">
                  <label>Card Number</label>
                  <input
                    value={newCard.number}
                    onChange={(e) => setNewCard({ ...newCard, number: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                <div className="account-input-group">
                  <label>Cardholder Name</label>
                  <input
                    value={newCard.name}
                    onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                    placeholder="Name on card"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="account-input-group">
                    <label>Expiry (MM/YY)</label>
                    <input
                      value={newCard.expiry}
                      onChange={(e) => setNewCard({ ...newCard, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="account-input-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      value={newCard.cvv}
                      onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                      placeholder="•••"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '10px 14px', background: 'rgba(16,185,129,0.05)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.1)' }}>
                  🔒 Only the last 4 digits and expiry date will be saved. CVV is never stored.
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={saving}>
                  {saving ? 'Saving...' : 'Add Card Securely'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default PaymentsPage;
