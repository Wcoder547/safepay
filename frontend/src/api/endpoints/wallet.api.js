import api from "../axios";

export const walletApi = {
  getBalance: () => api.get("/wallet/balance"),

  topUp: (amount) => api.post("/wallet/topup", { amount }),

  sendMoney: (data) => api.post("/wallet/send", data),

  getHistory: (params) => api.get("/wallet/history", { params }),

  getLogs: (params) => api.get("/wallet/logs", { params }),

  getStats: () => api.get("/wallet/stats"),

  exportLogs: () =>
    api.get("/wallet/logs", {
      params: { export: true },
      responseType: "blob",
    }),

  lookupUser: (phone) => api.get("/wallet/lookup", { params: { phone } }),

  getRecentContacts: () => api.get("/wallet/recent-contacts"),
};
