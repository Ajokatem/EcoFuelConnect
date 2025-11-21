import axios from "axios";

/**
 * BACKEND URL LOGIC
 * -----------------
 * Development: Uses localhost:5000
 * Production: Uses Render backend URL
 */

const baseURL =
  process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://ecofuelconnect-backend.onrender.com/api'
    : process.env.REACT_APP_API_URL_LOCAL || 'http://localhost:5000/api';

// Debug logging
console.log("🔧 API Configuration:", {
  ENV: process.env.REACT_APP_ENV,
  BASE_URL: baseURL,
  TIMEOUT: '60s (for Render cold starts)'
});

// Axios instance
const api = axios.create({
  baseURL,
  timeout: 60000, // 60 seconds for Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // IMPORTANT: Cookies/JWT
});

// Automatically attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url || "unknown";

      if (status === 401) {
        console.warn("401 Unauthorized - Token expired or invalid");
        // Auto-logout: Clear stale token and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
      if (status === 404) console.warn(`404 Not Found → ${url}`);
      if (status === 405) console.warn(`405 Method Not Allowed → ${url}`);
    } else if (error.code === "ECONNABORTED") {
      console.error("⏳ Request timeout");
    } else {
      console.error("🌐 Network error — backend unreachable");
    }

    return Promise.reject(error);
  }
);

export default api;
