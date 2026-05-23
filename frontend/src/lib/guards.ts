import { redirect } from "@tanstack/react-router";
import useAuthStore from "@/store/auth.store";
import { authApi } from "@/api/endpoints/auth.api";


export const requireAuth = async () => {
  const { isLoggedIn, user, setAuth, logout } = useAuthStore.getState();

  
  if (isLoggedIn && user?.is_verified) return;

 
  if (isLoggedIn && !user?.is_verified) {
    throw redirect({ to: "/verify_phone" });
  }

  
  try {
    const { data }    = await authApi.refresh();
    const meRes       = await authApi.me();
    const fetchedUser = meRes.data.data.user;

    setAuth(fetchedUser, data.data.access_token);

    if (!fetchedUser.is_verified) {
      throw redirect({ to: "/verify_phone" });
    }

  } catch {
    logout();
    throw redirect({ to: "/sign-in" });
  }
};

export const requireAdmin = async () => {
  await requireAuth(); 

  const { user } = useAuthStore.getState();

  if (user?.role !== "admin") {
    throw redirect({ to: "/dashboard" });
  }
};


export const requireGuest = async () => {
  const { isLoggedIn, user } = useAuthStore.getState();

  if (!isLoggedIn) return; 
  
  if (!user?.is_verified) {
    throw redirect({ to: "/verify_phone" });
  }

  
  throw redirect({ to: "/dashboard" });
};