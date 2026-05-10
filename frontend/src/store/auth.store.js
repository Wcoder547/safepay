import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  // ── State ──────────────────────────────
  user:         null,
  accessToken:  null,
  isLoggedIn:   false,

  // ── Actions ────────────────────────────
  setAuth: (user, accessToken) =>
    set({ user, accessToken, isLoggedIn: true }),

  setAccessToken: (accessToken) =>
    set({ accessToken }),

  updateUser: (updates) =>
    set((state) => ({ user: { ...state.user, ...updates } })),

  logout: () =>
    set({ user: null, accessToken: null, isLoggedIn: false }),

  // ── Getters ────────────────────────────
  getToken: () => get().accessToken,
}));

export default useAuthStore;