import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  CreditCard,
  MapPin,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../pages/AccountPage.css';

const navItems = [
  { label: 'Account Overview', icon: LayoutDashboard, path: '/account' },
  { label: 'Orders', icon: ShoppingBag, path: '/account/orders' },
  { label: 'Wishlist & Saved Items', icon: Heart, path: '/account/wishlist' },
  { label: 'Payments & Wallet', icon: CreditCard, path: '/account/payments' },
  { label: 'Address Management', icon: MapPin, path: '/account/addresses' },
];

const AccountLayout = ({ children }) => {
  const { userInfo, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to sign out?');
    if (!confirmed) return;
    logout();
    navigate('/login');
  };

  const initials = userInfo?.name
    ? userInfo.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className="account-layout animate-fade-in">
      {/* Sidebar */}
      <aside className="account-sidebar">
        <div className="account-sidebar-inner">
          <div className="account-sidebar-header">
            <div className="account-avatar">{initials}</div>
            <div>
              <div className="account-sidebar-name">{userInfo?.name}</div>
              <div className="account-sidebar-email">{userInfo?.email}</div>
            </div>
          </div>

          <nav className="account-nav">
            {navItems.map(({ label, icon: Icon, path }) => (
              <Link
                key={path}
                to={path}
                className={`account-nav-link${location.pathname === path ? ' active' : ''}`}
              >
                <span className="account-nav-icon">
                  <Icon size={16} strokeWidth={1.8} />
                </span>
                {label}
              </Link>
            ))}

            <div className="account-nav-logout">
              <button className="account-nav-link" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }} onClick={handleLogout}>
                <span className="account-nav-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>
                  <LogOut size={16} strokeWidth={1.8} color="#ef4444" />
                </span>
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="account-content">{children}</main>
    </div>
  );
};

export default AccountLayout;
