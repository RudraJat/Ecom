import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper container">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>AURA.</h2>
          <p>Elevating the everyday with premium essentials designed for modern living.</p>
        </div>
        
        <div className="footer-links-grid">
          <div className="footer-column">
            <h3>Shop</h3>
            <ul>
              <li><Link to="/?category=audio">Audio</Link></li>
              <li><Link to="/?category=electronics">Electronics</Link></li>
              <li><Link to="/?category=home">Home</Link></li>
              <li><Link to="/?category=accessories">Accessories</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AURA. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
