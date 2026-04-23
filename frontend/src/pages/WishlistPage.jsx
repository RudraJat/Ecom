import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import AccountLayout from '../components/AccountLayout';

const WishlistPage = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { dispatch } = useCart();

  const handleAddToCart = (product) => {
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: 1,
      },
    });
  };

  return (
    <AccountLayout>
      <h1 className="account-section-title">Wishlist & Saved Items</h1>
      <p className="account-section-subtitle">
        {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved to your wishlist.
      </p>

      {wishlistItems.length === 0 ? (
        <div className="account-empty">
          <div className="account-empty-icon">
            <Heart size={24} strokeWidth={1.5} />
          </div>
          <h3>Your wishlist is empty</h3>
          <p>Save products you love by clicking the heart icon on any product page.</p>
          <Link to="/" className="btn-primary">Explore Products</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((product) => (
            <div key={product._id} className="wishlist-product-card">
              {/* Remove button */}
              <button
                className="wishlist-remove-btn"
                onClick={() => toggleWishlist(product)}
                title="Remove from wishlist"
              >
                <Trash2 size={13} />
              </button>

              {/* Image */}
              <Link to={`/product/${product._id}`}>
                {product.image ? (
                  <img
                    src={product.image.startsWith('/') ? `http://localhost:5000${product.image}` : product.image}
                    alt={product.name}
                    className="wishlist-product-img"
                  />
                ) : (
                  <div className="wishlist-product-img-placeholder">
                    <Package size={32} />
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="wishlist-product-info">
                <Link to={`/product/${product._id}`}>
                  <div className="wishlist-product-name">{product.name}</div>
                </Link>
                <div className="wishlist-product-price">
                  ₹{(product.price || 0).toLocaleString('en-IN')}
                </div>
              </div>

              {/* Actions */}
              <div className="wishlist-product-actions">
                <button
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px 12px', fontSize: '0.82rem', borderRadius: 10 }}
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart size={14} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default WishlistPage;
