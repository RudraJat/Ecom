import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Creates an axios instance that always reads the token fresh from localStorage
const api = () => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}),
    },
  });
};

export default api;
