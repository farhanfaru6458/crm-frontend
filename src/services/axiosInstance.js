import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "crm_token";

const axiosInstance = axios.create({

  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Add auth token to every protected request
axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("crm_token") ||
    JSON.parse(localStorage.getItem("user"))?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
