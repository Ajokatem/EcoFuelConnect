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

// Axios instance with retry logic
const api = axios.create({
  baseURL,
  timeout: 90000, // 90 seconds for Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Request interceptor with retry logic
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add retry count
    config.retryCount = config.retryCount || 0;
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with retry and better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Check if we should retry
    if (config && config.retryCount < MAX_RETRIES) {
      // Retry on network errors or 5xx errors (server issues)
      const shouldRetry = 
        !error.response || 
        error.code === 'ECONNABORTED' ||
        error.code === 'ERR_NETWORK' ||
        (error.response && error.response.status >= 500);
      
      if (shouldRetry) {
        config.retryCount += 1;
        console.log(`🔄 Retrying request (${config.retryCount}/${MAX_RETRIES})...`);
        
        await sleep(RETRY_DELAY * config.retryCount);
        return api(config);
      }
    }
    
    // Handle specific errors
    if (error.response) {
      const status = error.response.status;
      const url = config?.url || "unknown";

      if (status === 401) console.warn("401 Unauthorized");
      if (status === 404) console.warn(`404 Not Found → ${url}`);
      if (status === 405) console.warn(`405 Method Not Allowed → ${url}`);
    } else if (error.code === "ECONNABORTED") {
      console.error("⏳ Request timeout - Backend may be waking up");
      error.message = "Server is starting up. Please wait a moment and try again.";
    } else if (error.code === "ERR_NETWORK") {
      console.error("🌐 Network error - Backend unreachable");
      error.message = "Unable to connect to server. Please check your internet connection or try again later.";
    }

    return Promise.reject(error);
  }
);

export default api;
