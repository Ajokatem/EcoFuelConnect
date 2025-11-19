import axios from 'axios';

const baseURL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://ecofuelconnect-backend.onrender.com/api";

console.log("🔧 API Base URL Loaded:", baseURL);

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

export default api;
