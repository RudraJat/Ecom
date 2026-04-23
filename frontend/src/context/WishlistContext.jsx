import { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const WishlistContext = createContext();

const initialState = {
  wishlistItems: localStorage.getItem('wishlistItems')
    ? JSON.parse(localStorage.getItem('wishlistItems'))
    : [],
  loading: false,
};

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'WISHLIST_LOADING':
      return { ...state, loading: true };
    case 'WISHLIST_SET':
      return { ...state, loading: false, wishlistItems: action.payload };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { userInfo } = useAuth();

  // Sync wishlist from backend when user logs in
  useEffect(() => {
    if (userInfo && userInfo.token) {
      const syncWishlistFromBackend = async () => {
        try {
          dispatch({ type: 'WISHLIST_LOADING' });
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          const { data } = await api().get('/api/users/profile', config);
          if (data.wishlist) {
            dispatch({ type: 'WISHLIST_SET', payload: data.wishlist });
          }
        } catch (err) {
          console.error('Failed to sync wishlist from backend:', err);
        }
      };
      syncWishlistFromBackend();
    }
  }, [userInfo?.token, userInfo?._id]);

  // Persist to localStorage whenever wishlistItems changes
  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
  }, [state.wishlistItems]);

  const toggleWishlist = useCallback(
    async (product) => {
      if (!userInfo) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await api().put(`/api/users/wishlist/${product._id}`, {}, config);
        dispatch({ type: 'WISHLIST_SET', payload: data });
      } catch (err) {
        console.error('Toggle wishlist error:', err);
        // Optimistic local fallback
        const exists = state.wishlistItems.find((i) => i._id === product._id);
        if (exists) {
          dispatch({
            type: 'WISHLIST_SET',
            payload: state.wishlistItems.filter((i) => i._id !== product._id),
          });
        } else {
          dispatch({
            type: 'WISHLIST_SET',
            payload: [...state.wishlistItems, product],
          });
        }
      }
    },
    [userInfo, state.wishlistItems]
  );

  const isWishlisted = useCallback(
    (productId) => state.wishlistItems.some((i) => i._id === productId),
    [state.wishlistItems]
  );

  const setWishlist = (items) => dispatch({ type: 'WISHLIST_SET', payload: items });

  return (
    <WishlistContext.Provider
      value={{ wishlistItems: state.wishlistItems, toggleWishlist, isWishlisted, setWishlist, loading: state.loading }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
