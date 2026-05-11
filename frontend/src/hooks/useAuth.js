import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "../api/endpoints/auth.api";
import useAuthStore from "../store/auth.store";
import { QUERY_KEYS } from "../api/queryKeys";


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


export const useRegister = () => {
  const setAuth    = useAuthStore((s) => s.setAuth);
  const navigate   = useNavigate();

  return useMutation({
    mutationFn: (formData) => authApi.register(formData),

    onSuccess: ({ data }) => {
      const { user, access_token } = data.data;
      setAuth(user, access_token);
      navigate({ to: "/verify_phone" });
    },
  });
};


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
        navigate({ to: "/verify_phone" });
      } else {
        navigate({ to: "/dashboard" });
      }
    },
  });
};


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


export const useSendOtp = () => {
  return useMutation({
    mutationFn: (type) => authApi.sendOtp(type),
  });
};


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


export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (phone) => authApi.forgotPassword(phone),
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authApi.resetPassword(data),

    onSuccess: () => {
      navigate({ to: "/sign-in" });
    },
  });
};


export const useChangePin = () => {
  return useMutation({
    mutationFn: (data) => authApi.changePin(data),
  });
};


export const useVerifyPin = () => {
  return useMutation({
    mutationFn: (pin) => authApi.verifyPin(pin),
  });
};