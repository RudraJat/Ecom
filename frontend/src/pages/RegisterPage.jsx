import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authBg from '../assets/auth_bg.png';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const { register, userInfo, error, loading, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    return () => clearError();
  }, [navigate, userInfo, redirect, clearError]);

  const validatePassword = (pass) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    
    if (pass.length < minLength) return "Password must be at least 8 characters long.";
    if (!hasUpper) return "Password must contain at least one uppercase letter.";
    if (!hasLower) return "Password must contain at least one lowercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    if (!hasSpecial) return "Password must contain at least one special character.";
    
    return null;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    const passError = validatePassword(password);
    if (passError) {
      setValidationError(passError);
      return;
    }

    await register(name, email, password);
  };

  return (
    <div className="auth-layout animate-fade-in">
      <div className="auth-image-panel">
        <img src={authBg} alt="Abstract Aura Background" />
        <div className="auth-image-overlay">
          <h2>Join AURA.</h2>
          <p>Create an account to track your orders, save your preferences, and experience premium shopping.</p>
        </div>
      </div>
      
      <div className="auth-form-panel">
        <div className="auth-form-container glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '32px' }}>Create Account</h1>
          
          {(error || validationError) && (
            <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} />
              {validationError || error}
            </div>
          )}
          
          <form onSubmit={submitHandler}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Create a strong password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationError('');
                }}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="Confirm your password" 
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setValidationError('');
                }}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
              {loading ? 'Creating Account...' : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>
          
          <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
