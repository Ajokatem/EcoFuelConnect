import axios from 'axios';

// Determine base URL based on environment
const baseURL =
  process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://ecofuelconnect-backend.onrender.com/api'
    : process.env.REACT_APP_API_URL_LOCAL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ✅ Request interceptor (optional: attach token)
api.interceptors.request.use(
  (config) => {
    // Example: if you’re storing token in localStorage or context
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized: Token may have expired or is invalid.');
      // Components should handle logout or redirect
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Please check your network connection.');
    } else if (!error.response) {
      console.error('Network error: Backend may be unreachable.');
    }
    return Promise.reject(error);
  }
);

export default api;
