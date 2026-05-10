import api from "../axios";

export const authApi = {
  register: (data) =>
    api.post("/auth/register", data),

  login: (data) =>
    api.post("/auth/login", data),

  logout: () =>
    api.post("/auth/logout"),

  refresh: () =>
    api.post("/auth/refresh"),

  me: () =>
    api.get("/auth/me"),

  sendOtp: (type) =>
    api.post("/auth/send-otp", { type }),

  verifyOtp: (code, type) =>
    api.post("/auth/verify-otp", { code, type }),

  forgotPassword: (phone) =>
    api.post("/auth/forgot-password", { phone }),

  resetPassword: (data) =>
    api.post("/auth/reset-password", data),

  changePin: (data) =>
    api.post("/auth/pin/change", data),

  verifyPin: (pin) =>
    api.post("/auth/pin/verify", { pin }),
};