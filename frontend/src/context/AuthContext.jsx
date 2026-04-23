import { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import api from '../utils/api';

const AuthContext = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  loading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, userInfo: action.payload, error: null };
    case 'AUTH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...state, userInfo: null, error: null };
    case 'AUTH_CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Axios interceptor to attach token
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (state.userInfo && state.userInfo.token) {
          config.headers.Authorization = `Bearer ${state.userInfo.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [state.userInfo]);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'AUTH_REQUEST' });
    try {
      const { data } = await api().post('/api/users/login', { email, password });
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      return true;
    } catch (error) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
      return false;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    dispatch({ type: 'AUTH_REQUEST' });
    try {
      const { data } = await api().post('/api/users', { name, email, password });
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      return true;
    } catch (error) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    dispatch({ type: 'AUTH_REQUEST' });
    try {
      const { data } = await api().put('/api/users/profile', profileData);
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userInfo');
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
