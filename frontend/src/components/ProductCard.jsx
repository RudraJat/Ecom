import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { userInfo } = useAuth();

  // Add slight staggered animation delay based on index
  const delay = `${index * 0.1}s`;
  const wishlisted = isWishlisted(product._id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      navigate(`/login?redirect=/product/${product._id}`);
      return;
    }

    await toggleWishlist(product);
  };

  return (
    <div className="product-card animate-fade-in" style={{ animationDelay: delay }}>
      <div className="card-media">
        <Link to={`/product/${product._id}`} className="card-image-link">
          <div className="card-image-wrapper">
            <img src={product.image} alt={product.name} className="card-image" />
            <div className="card-overlay">
              <span className="view-text">View Details</span>
            </div>
          </div>
        </Link>
        <button
          className={`wishlist-btn${wishlisted ? ' active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="card-content">
        <div className="card-header">
          <span className="card-category">{product.category}</span>
          <span className="card-price">${product.price}</span>
        </div>
        
        <Link to={`/product/${product._id}`} className="card-title-link">
          <h3 className="card-title">{product.name}</h3>
        </Link>
        
        <div className="card-footer">
          <Link to={`/product/${product._id}`} className="btn-icon">
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
