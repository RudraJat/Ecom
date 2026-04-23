import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Package } from 'lucide-react';
import api from '../utils/api';
import AccountLayout from '../components/AccountLayout';

const getStatusBadge = (order) => {
  if (order.isDelivered) return 'delivered';
  if (order.isPaid) return 'processing';
  return 'pending';
};

const getStatusLabel = (order) => {
  if (order.isDelivered) return 'Delivered';
  if (order.isPaid) return 'Processing';
  return 'Pending Payment';
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api().get('/api/orders/myorders');
        setOrders(data);
      } catch (err) {
        setError('Could not load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <AccountLayout>
      <h1 className="account-section-title">My Orders</h1>
      <p className="account-section-subtitle">Track, review and manage all your purchases.</p>

      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          Loading orders...
        </div>
      )}

      {error && (
        <div className="account-alert error">{error}</div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="account-empty">
          <div className="account-empty-icon">
            <ShoppingBag size={24} strokeWidth={1.5} />
          </div>
          <h3>No orders yet</h3>
          <p>When you place orders, they'll appear here.</p>
          <Link to="/" className="btn-primary">Start Shopping</Link>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-top">
                <div>
                  <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                  <div className="order-date">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                </div>
                <span className={`order-badge ${getStatusBadge(order)}`}>
                  {getStatusLabel(order)}
                </span>
              </div>

              <div className="order-items-row">
                {order.orderItems.map((item, idx) => (
                  <span key={idx} className="order-item-chip">
                    {item.name} × {item.qty}
                  </span>
                ))}
              </div>

              <div className="order-card-bottom">
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 2 }}>Total</div>
                  <div className="order-total">₹{order.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {order.shippingAddress?.city}, {order.shippingAddress?.country}
                  </div>
                  <Link to={`/orders/${order._id}`} className="order-view-btn">
                    <Package size={14} />
                    Details <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default OrdersPage;
