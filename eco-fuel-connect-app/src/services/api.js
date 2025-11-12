import axios from 'axios';

// Base URL from environment variables
const baseURL =
  process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://ecofuelconnect-backend.onrender.com/api'
    : process.env.REACT_APP_API_URL_LOCAL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL,
  timeout: 15000, // increase timeout for slower networks
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies with requests
});

// Attach token automatically if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Backend returned a response
      if (error.response.status === 401) {
        console.warn('Unauthorized: Token may be expired or invalid.');
        // Optional: trigger logout in frontend here
      } else if (error.response.status === 404) {
        console.warn(`API endpoint not found: ${error.config.url}`);
      } else if (error.response.status === 405) {
        console.warn(`Method not allowed: ${error.config.method} on ${error.config.url}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Check your network connection.');
    } else {
      console.error('Network error: Backend may be unreachable.');
    }
    return Promise.reject(error);
  }
);

export default api;
