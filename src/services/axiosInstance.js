import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "crm_token";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to every protected request
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;