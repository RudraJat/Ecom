import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authBg from '../assets/auth_bg.png'; // Make sure this exists

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, userInfo, error, loading, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    return () => clearError(); // Clear error on unmount
  }, [navigate, userInfo, redirect, clearError]);

  const submitHandler = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="auth-layout animate-fade-in">
      <div className="auth-image-panel">
        <img src={authBg} alt="Abstract Aura Background" />
        <div className="auth-image-overlay">
          <h2>Welcome Back</h2>
          <p>Sign in to access your exclusive orders, preferences, and curated recommendations.</p>
        </div>
      </div>
      
      <div className="auth-form-panel">
        <div className="auth-form-container glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '32px' }}>Sign In</h1>
          
          {error && (
            <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}
          
          <form onSubmit={submitHandler}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
              {loading ? 'Signing in...' : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>
          
          <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            New to AURA? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
