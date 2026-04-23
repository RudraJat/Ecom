import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, CreditCard, CheckCircle, AlertCircle,
  ChevronRight, ShoppingBag, Truck, Lock
} from 'lucide-react';
import api, { BASE_URL } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const { cartItems, dispatch } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState('cod'); // 'cod' | card._id
  const [shipping, setShipping] = useState({
    fullName: '', phone: '', address: '', city: '', state: '', postalCode: '', country: 'India',
  });
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);

  // Prices
  const itemsPrice = cartItems.reduce((a, i) => a + i.qty * i.price, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 99;
  const taxPrice = +(itemsPrice * 0.18).toFixed(2);
  const totalPrice = +(itemsPrice + shippingPrice + taxPrice).toFixed(2);

  useEffect(() => {
    if (!userInfo) { navigate('/login?redirect=checkout'); return; }
    if (cartItems.length === 0 && !orderId) { navigate('/cart'); return; }
    // Fetch profile for saved addresses + cards
    api().get('/api/users/profile').then(({ data }) => {
      setSavedAddresses(data.addresses || []);
      setSavedCards(data.savedCards || []);
      // Pre-select default address
      const def = (data.addresses || []).find((a) => a.isDefault);
      if (def) {
        setSelectedAddress(def._id);
        setUseNewAddress(false);
        setShipping({
          fullName: def.fullName,
          phone: def.phone,
          address: def.address,
          city: def.city,
          state: def.state,
          postalCode: def.postalCode,
          country: def.country,
        });
      }
    }).catch(() => {});
  }, [userInfo]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddress(addr._id);
    setUseNewAddress(false);
    setShipping({
      fullName: addr.fullName, phone: addr.phone, address: addr.address,
      city: addr.city, state: addr.state, postalCode: addr.postalCode, country: addr.country,
    });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const placeOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      const paymentMethod = selectedCard === 'cod'
        ? 'Cash on Delivery'
        : `Card ending in ${savedCards.find((c) => c._id === selectedCard)?.last4 || '****'}`;

      const { data } = await api().post('/api/orders', {
        orderItems: cartItems.map((i) => ({
          name: i.name,
          qty: i.qty,
          image: i.image,
          price: i.price,
          product: i.product,
        })),
        shippingAddress: {
          address: shipping.address,
          city: shipping.city,
          postalCode: shipping.postalCode,
          country: shipping.country,
        },
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      // Clear cart
      dispatch({ type: 'CART_CLEAR' });
      localStorage.removeItem('cartItems');

      setOrderId(data._id);
      setStep(3); // success
    } catch (err) {
      setError(err.response?.data?.message || 'Order placement failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="checkout-success animate-fade-in">
        <div className="checkout-success-icon">
          <CheckCircle size={48} color="#10b981" strokeWidth={1.5} />
        </div>
        <h1>Order Placed!</h1>
        <p>Your order <strong>#{orderId?.slice(-8).toUpperCase()}</strong> has been saved successfully.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
          <button className="btn-primary" onClick={() => navigate('/account/orders')}>
            <ShoppingBag size={16} /> View Orders
          </button>
          <button className="btn-outline" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  const shippingFilled = shipping.fullName && shipping.address && shipping.city && shipping.postalCode;

  return (
    <div className="checkout-page animate-fade-in">
      <div className="checkout-container">

        {/* ── Stepper ─────────────────────────────────────────────── */}
        <div className="checkout-stepper">
          {STEPS.map((s, i) => (
            <div key={s} className={`checkout-step${step >= i ? ' active' : ''}${step > i ? ' done' : ''}`}>
              <div className="checkout-step-num">{step > i ? '✓' : i + 1}</div>
              <span>{s}</span>
              {i < STEPS.length - 1 && <div className="checkout-step-line" />}
            </div>
          ))}
        </div>

        <div className="checkout-body">
          {/* ── LEFT PANEL ──────────────────────────────────────── */}
          <div className="checkout-left">

            {error && (
              <div className="account-alert error" style={{ marginBottom: 20 }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {/* STEP 0: Shipping */}
            {step === 0 && (
              <div className="checkout-card">
                <div className="checkout-card-title">
                  <MapPin size={18} /> Delivery Address
                </div>

                {/* Saved addresses */}
                {savedAddresses.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 10 }}>Saved Addresses</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr._id}
                          type="button"
                          className={`checkout-address-option${selectedAddress === addr._id && !useNewAddress ? ' selected' : ''}`}
                          onClick={() => handleSelectSavedAddress(addr)}
                        >
                          <div style={{ fontWeight: 600, marginBottom: 2 }}>{addr.fullName} · {addr.label || 'Address'}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {addr.address}, {addr.city}, {addr.state} — {addr.postalCode}
                          </div>
                        </button>
                      ))}
                      <button
                        type="button"
                        className={`checkout-address-option${useNewAddress ? ' selected' : ''}`}
                        onClick={() => { setUseNewAddress(true); setSelectedAddress(null); }}
                      >
                        <div style={{ fontWeight: 600 }}>+ Enter a new address</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* New address form */}
                {(useNewAddress || savedAddresses.length === 0) && (
                  <form id="shipping-form" onSubmit={handleShippingSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div className="account-input-group">
                        <label>Full Name *</label>
                        <input value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} required />
                      </div>
                      <div className="account-input-group">
                        <label>Phone *</label>
                        <input type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} required />
                      </div>
                      <div className="account-input-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Street Address *</label>
                        <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="Flat, Building, Street" required />
                      </div>
                      <div className="account-input-group">
                        <label>City *</label>
                        <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} required />
                      </div>
                      <div className="account-input-group">
                        <label>State *</label>
                        <input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} required />
                      </div>
                      <div className="account-input-group">
                        <label>PIN Code *</label>
                        <input value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} required />
                      </div>
                      <div className="account-input-group">
                        <label>Country</label>
                        <input value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} />
                      </div>
                    </div>
                    <button type="submit" className="btn-primary checkout-next-btn">
                      Continue to Payment <ChevronRight size={16} />
                    </button>
                  </form>
                )}

                {/* When a saved address is selected */}
                {!useNewAddress && selectedAddress && (
                  <button className="btn-primary checkout-next-btn" onClick={() => setStep(1)}>
                    Continue to Payment <ChevronRight size={16} />
                  </button>
                )}
              </div>
            )}

            {/* STEP 1: Payment */}
            {step === 1 && (
              <div className="checkout-card">
                <div className="checkout-card-title">
                  <CreditCard size={18} /> Payment Method
                </div>
                <form onSubmit={handlePaymentSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    {/* Saved cards */}
                    {savedCards.map((card) => (
                      <button
                        key={card._id}
                        type="button"
                        className={`checkout-address-option${selectedCard === card._id ? ' selected' : ''}`}
                        onClick={() => setSelectedCard(card._id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontWeight: 700, fontSize: '0.8rem', background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: 6 }}>{card.brand}</span>
                          <span style={{ fontWeight: 600 }}>•••• {card.last4}</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Exp. {card.expiry}</span>
                          {card.isDefault && <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 6, color: 'var(--text-secondary)' }}>Default</span>}
                        </div>
                      </button>
                    ))}

                    {/* Cash on Delivery */}
                    <button
                      type="button"
                      className={`checkout-address-option${selectedCard === 'cod' ? ' selected' : ''}`}
                      onClick={() => setSelectedCard('cod')}
                    >
                      <div style={{ fontWeight: 600 }}>🚚 Cash on Delivery</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Pay when your order arrives</div>
                    </button>

                    {/* UPI option */}
                    <button
                      type="button"
                      className={`checkout-address-option${selectedCard === 'upi' ? ' selected' : ''}`}
                      onClick={() => setSelectedCard('upi')}
                    >
                      <div style={{ fontWeight: 600 }}>📱 UPI / Net Banking</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Pay via UPI or net banking</div>
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" className="btn-outline" style={{ padding: '12px 20px' }} onClick={() => setStep(0)}>
                      Back
                    </button>
                    <button type="submit" className="btn-primary checkout-next-btn">
                      Review Order <ChevronRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Review */}
            {step === 2 && (
              <div className="checkout-card">
                <div className="checkout-card-title">Review Your Order</div>

                {/* Shipping summary */}
                <div className="checkout-review-section">
                  <div className="checkout-review-label"><MapPin size={14} /> Delivering to</div>
                  <div className="checkout-review-value">
                    {shipping.fullName} · {shipping.address}, {shipping.city}, {shipping.state} — {shipping.postalCode}
                  </div>
                </div>

                {/* Payment summary */}
                <div className="checkout-review-section">
                  <div className="checkout-review-label"><CreditCard size={14} /> Payment</div>
                  <div className="checkout-review-value">
                    {selectedCard === 'cod' ? 'Cash on Delivery' :
                     selectedCard === 'upi' ? 'UPI / Net Banking' :
                     `Card ending in ${savedCards.find((c) => c._id === selectedCard)?.last4}`}
                  </div>
                </div>

                {/* Items */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, marginTop: 4 }}>
                  {cartItems.map((item) => (
                    <div key={item.product} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                      <img
                        src={item.image?.startsWith('/') ? `${BASE_URL}${item.image}` : item.image}
                        alt={item.name}
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, background: 'var(--surface-light)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Qty: {item.qty}</div>
                      </div>
                      <div style={{ fontWeight: 600 }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="button" className="btn-outline" style={{ padding: '12px 20px' }} onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button
                    className="btn-primary checkout-next-btn"
                    onClick={placeOrder}
                    disabled={placing}
                  >
                    <Lock size={14} />
                    {placing ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Order Summary ─────────────────────────────── */}
          <div className="checkout-right">
            <div className="checkout-card">
              <div className="checkout-card-title">Order Summary</div>

              {cartItems.map((item) => (
                <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name} × {item.qty}</span>
                  <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}

              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 12, paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <span>Shipping</span>
                  <span>{shippingPrice === 0 ? <span style={{ color: '#10b981' }}>Free</span> : `₹${shippingPrice}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <span>GST (18%)</span>
                  <span>₹{taxPrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {shippingPrice === 0 && (
                <div style={{ marginTop: 12, fontSize: '0.82rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Truck size={14} /> Free shipping applied!
                </div>
              )}
              {shippingPrice > 0 && (
                <div style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Add ₹{(1000 - itemsPrice).toFixed(0)} more for free shipping
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <Lock size={14} /> Secure 256-bit SSL checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
