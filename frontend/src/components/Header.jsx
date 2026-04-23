import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  LayoutDashboard,
  Package,
  Heart,
  CreditCard,
  MapPin,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const dropdownItems = [
  { label: 'Account Overview', icon: LayoutDashboard, path: '/account' },
  { label: 'Orders', icon: Package, path: '/account/orders' },
  { label: 'Wishlist & Saved Items', icon: Heart, path: '/account/wishlist' },
  { label: 'Payments & Wallet', icon: CreditCard, path: '/account/payments' },
  { label: 'Address Management', icon: MapPin, path: '/account/addresses' },
];

const Header = () => {
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logoutHandler = () => {
    const confirmed = window.confirm('Are you sure you want to sign out?');
    if (!confirmed) return;
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = userInfo?.name
    ? userInfo.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="header-wrapper">
      <div className="container">
        <nav className="navbar glass-panel">
          <Link to="/" className="brand-logo">
            <span className="logo-icon"></span>
            AURA.
          </Link>

          <div className="nav-links">
            <Link to="/" className="nav-link">Shop</Link>
            <Link to="/story" className="nav-link">Story</Link>
            <Link to="/journal" className="nav-link">Journal</Link>
          </div>

          <div className="nav-actions">
            {userInfo ? (
              <div className="profile-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="profile-trigger"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="profile-avatar">{initials}</div>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className={`profile-chevron${dropdownOpen ? ' open' : ''}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="profile-dropdown-name">{userInfo.name}</div>
                      <div className="profile-dropdown-email">{userInfo.email}</div>
                    </div>

                    <div className="profile-dropdown-items">
                      {dropdownItems.map(({ label, icon: Icon, path }) => (
                        <Link
                          key={path}
                          to={path}
                          className="profile-dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Icon size={15} strokeWidth={1.8} />
                          {label}
                        </Link>
                      ))}
                    </div>

                    <div className="profile-dropdown-footer">
                      <button className="profile-dropdown-logout" onClick={logoutHandler}>
                        <LogOut size={15} strokeWidth={1.8} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="action-btn" title="Login">
                <User size={20} strokeWidth={1.5} />
              </Link>
            )}

            <Link to="/cart" className="action-btn cart-btn">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartItems.length > 0 && (
                <span className="cart-badge">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
