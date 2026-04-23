import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api().get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content animate-fade-in">
            <h1 className="hero-title">
              Elevate Your <br/>
              <span className="text-gradient">Everyday.</span>
            </h1>
            <p className="hero-subtitle">
              Discover a curated collection of premium essentials designed for modern living.
            </p>
            <button 
              className="btn-primary hero-btn"
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section id="products-section" className="products-section container">
        <div className="section-header flex-between animate-fade-in">
          <h2 className="section-title">
            {categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Collection` : 'New Arrivals'}
          </h2>
          {!categoryFilter && (
            <span 
              className="section-link" 
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ cursor: 'pointer' }}
            >
              View All
            </span>
          )}
        </div>

        {loading ? (
          <div className="loader">Loading curated items...</div>
        ) : error ? (
          <div className="error-msg">Failed to load products. Please check the backend server.</div>
        ) : (
          <div className="product-grid">
            {(categoryFilter 
              ? products.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase()) 
              : products
            ).map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
