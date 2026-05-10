import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "../api/endpoints/auth.api";
import useAuthStore from "../store/auth.store";
import { QUERY_KEYS } from "../api/queryKeys";

// ─────────────────────────────────────────
// GET current user (runs on app load)
// ─────────────────────────────────────────
export const useMe = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return useQuery({
    queryKey: QUERY_KEYS.user,
    queryFn:  async () => {
      const { data } = await authApi.me();
      return data.data.user;
    },
    enabled:  isLoggedIn,  // only fetch if logged in
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

// ─────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────
export const useRegister = () => {
  const setAuth    = useAuthStore((s) => s.setAuth);
  const navigate   = useNavigate();

  return useMutation({
    mutationFn: (formData) => authApi.register(formData),

    onSuccess: ({ data }) => {
      const { user, access_token } = data.data;
      setAuth(user, access_token);
      // user is not verified yet → go to OTP page
      navigate({ to: "/verify-phone" });
    },
  });
};

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
export const useLogin = () => {
  const setAuth  = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials),

    onSuccess: ({ data }) => {
      const { user, access_token, requires_verification } = data.data;
      setAuth(user, access_token);

      if (requires_verification) {
        // Unverified user → send OTP then verify
        navigate({ to: "/verify-phone" });
      } else {
        navigate({ to: "/dashboard" });
      }
    },
  });
};

// ─────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────
export const useLogout = () => {
  const logout      = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const navigate    = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),

    onSettled: () => {
      // Always clear state even if API call fails
      logout();
      queryClient.clear();  // wipe all cached data
      navigate({ to: "/login" });
    },
  });
};

// ─────────────────────────────────────────
// SEND OTP
// ─────────────────────────────────────────
export const useSendOtp = () => {
  return useMutation({
    mutationFn: (type) => authApi.sendOtp(type),
  });
};

// ─────────────────────────────────────────
// VERIFY OTP
// ─────────────────────────────────────────
export const useVerifyOtp = () => {
  const updateUser  = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();
  const navigate    = useNavigate();

  return useMutation({
    mutationFn: ({ code, type }) => authApi.verifyOtp(code, type),

    onSuccess: (_, { type }) => {
      if (type === "PHONE_VERIFY") {
        // Mark user as verified in store + cache
        updateUser({ is_verified: true });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
        navigate({ to: "/dashboard" });
      }
      if (type === "EMAIL_VERIFY") {
        updateUser({ is_email_verified: true });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
      }
    },
  });
};

// ─────────────────────────────────────────
// FORGOT PASSWORD
// ─────────────────────────────────────────
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (phone) => authApi.forgotPassword(phone),
  });
};

// ─────────────────────────────────────────
// RESET PASSWORD
// ─────────────────────────────────────────
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authApi.resetPassword(data),

    onSuccess: () => {
      navigate({ to: "/login" });
    },
  });
};

// ─────────────────────────────────────────
// CHANGE PIN
// ─────────────────────────────────────────
export const useChangePin = () => {
  return useMutation({
    mutationFn: (data) => authApi.changePin(data),
  });
};

// ─────────────────────────────────────────
// VERIFY PIN (before send money)
// ─────────────────────────────────────────
export const useVerifyPin = () => {
  return useMutation({
    mutationFn: (pin) => authApi.verifyPin(pin),
  });
};