import axios from "axios";

/**
 * BACKEND URL LOGIC
 * -----------------
 * React ONLY exposes env vars starting with REACT_APP_...
 * So we use REACT_APP_BACKEND_URL for production
 * And fallback to localhost in development.
 */

const baseURL =
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:5000/api";

// Debug logging to confirm correct URL at build/runtime
console.log("🔧 API Configuration:", {
  NODE_ENV: process.env.NODE_ENV,
  BACKEND_ENV_VAR: process.env.REACT_APP_BACKEND_URL,
  FINAL_BASE_URL: baseURL,
});

// Axios instance
const api = axios.create({
  baseURL,
  timeout: 15000,
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url || "unknown";

      if (status === 401) console.warn("401 Unauthorized");
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
