import axios from "axios";
import useAuthStore from "../store/auth.store";

const api = axios.create({
  baseURL:        import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,   // sends HttpOnly refresh_token cookie automatically
  timeout:         10000,
});

// ── Request interceptor — attach access token ──────────────
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — silent token refresh ────────────
let isRefreshing   = false;
let failedQueue    = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Not a 401 or already retried → just reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't retry refresh endpoint itself
    if (originalRequest.url === "/auth/refresh") {
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue requests while refresh is in progress
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Refresh token is in HttpOnly cookie — sent automatically
      const { data } = await api.post("/auth/refresh");
      const newToken = data.data.access_token;

      useAuthStore.getState().setAccessToken(newToken);
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

export default api;