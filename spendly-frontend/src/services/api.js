import axios from "axios";
import { store } from "../app/store";
import { logout } from "../features/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3033";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) config.headers["auth-token"] = token;
  return config;
});

// Global response interceptor: handle 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Clear redux auth state + token; ProtectedRoute will send user to /login
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
