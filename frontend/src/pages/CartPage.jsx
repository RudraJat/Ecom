import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowRight } from 'lucide-react';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, dispatch } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const removeFromCartHandler = (id) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: id });
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  return (
    <div className="cart-page container animate-fade-in">
      <h1 className="page-title">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart-message glass-panel">
          <p>Your cart is currently empty.</p>
          <Link to="/" className="btn-primary mt-4">
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item glass-panel">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <Link to={`/product/${item.product}`} className="item-name">
                    {item.name}
                  </Link>
                  <p className="item-price">${item.price}</p>
                </div>
                
                <div className="cart-item-actions">
                  <select 
                    value={item.qty} 
                    onChange={(e) => dispatch({ 
                      type: 'CART_ADD_ITEM', 
                      payload: { ...item, qty: Number(e.target.value) } 
                    })}
                    className="qty-select"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  
                  <button 
                    className="remove-btn" 
                    onClick={() => removeFromCartHandler(item.product)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary glass-panel">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
              <span className="summary-value">
                ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
              </span>
            </div>
            
            <button 
              className="btn-primary checkout-btn" 
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
