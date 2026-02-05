// src/api.js
import axios from "axios";

//export const BASE_URL = "http://127.0.0.1:8000/";
$backendUrl = "https://shoppit-app-4.onrender.com"

export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach access token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // ✅ consistent
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid tokens automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken"); // ✅ consistent

      if (refreshToken) {
        try {
          const res = await axios.post(`${BASE_URL}api/token/refresh/`, {
            refresh: refreshToken,
          });

          localStorage.setItem("accessToken", res.data.access);

          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch (refreshErr) {
          console.error(
            "Token refresh failed:",
            refreshErr.response?.data || refreshErr.message
          );
          // Optionally redirect to login here
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
