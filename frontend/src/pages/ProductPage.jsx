import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { userInfo } = useAuth();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty,
      },
    });
    navigate('/cart');
  };

  const wishlistHandler = async () => {
    if (!userInfo) {
      navigate(`/login?redirect=/product/${id}`);
      return;
    }
    await toggleWishlist(product);
  };

  if (loading) return <div className="loader container">Loading masterpiece...</div>;

  return (
    <div className="product-page container animate-fade-in">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Back to Collection
      </Link>

      <div className="product-layout">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} className="product-hero-image" />
        </div>

        <div className="product-details-section">
          <span className="product-brand">{product.brand}</span>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">${product.price}</p>
          
          <div className="product-description-box">
            <p>{product.description}</p>
          </div>

          <div className="product-actions">
            {product.countInStock > 0 && (
              <div className="qty-selector">
                <span className="meta-label">Quantity</span>
                <select 
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="qty-dropdown"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="product-action-row">
              <button
                className="btn-primary add-cart-btn"
                disabled={product.countInStock === 0}
                onClick={addToCartHandler}
              >
                <ShoppingBag size={20} />
                {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                className={`btn-outline wishlist-action-btn${isWishlisted(product._id) ? ' active' : ''}`}
                onClick={wishlistHandler}
              >
                <Heart size={18} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
                {isWishlisted(product._id) ? 'Saved' : 'Add to Wishlist'}
              </button>
            </div>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Availability</span>
              <span className="meta-value">{product.countInStock > 0 ? 'In Stock' : 'Unavailable'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
