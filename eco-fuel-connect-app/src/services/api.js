import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor to add auth token
// To set auth token, use api.defaults.headers.common['Authorization'] = `Bearer <token>` from React context/state

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      // Clear token/user from React context or state management (handled in component)
      // Don't redirect here - let the component handle it
      // Components should check authentication state and redirect accordingly
    }
    return Promise.reject(error);
  }
);

export default api;