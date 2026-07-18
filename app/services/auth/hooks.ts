import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import {
  LoginRequest,
  RegisterRequest,
  GoogleOAuthRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "../../types/auth";
import { useNotifications } from "../../context/NotificationContext";
import { userKeys } from "../user/hooks";
import Cookies from "js-cookie";
import { setActiveIdentity, clearActiveIdentity } from "../../lib/identity";

const PERSIST_BASE_KEY = "shelf-query-cache";

/** Removes all persisted React Query caches so no user data survives logout. */
function purgePersistedCache() {
  if (typeof window === "undefined") return;
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith(PERSIST_BASE_KEY))
    .forEach((k) => window.localStorage.removeItem(k));
}

export const useAuthActions = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) =>
      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw { status: res.status, data };
        return data;
      }),
    onSuccess: (data) => {
      // Set the user data in the cache immediately to avoid fetch delay
      if (data.user) {
        setActiveIdentity(data.user.id);
        queryClient.setQueryData(userKeys.me(), data.user);
      }
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      addNotification("success", "Welcome back!");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) =>
      fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw { status: res.status, data: json };
        return json;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      addNotification("success", "Account created successfully!");
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: (data: GoogleOAuthRequest) =>
      fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw { status: res.status, data: json };
        return json;
      }),
    onSuccess: (data) => {
      if (data.user) {
        setActiveIdentity(data.user.id);
        queryClient.setQueryData(userKeys.me(), data.user);
      }
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      addNotification("success", "Signed in with Google");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () =>
      fetch("/api/auth/logout", { method: "POST" }).then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw { status: res.status, data: json };
        return json;
      }),
    onSettled: () => {
      // Cookies cleared by proxy. Clear client cache and reload.
      Cookies.remove("accessToken");
      queryClient.clear();
      // Drop the persisted cache and identity so the next user on this device
      // never inherits the previous user's cached data.
      purgePersistedCache();
      clearActiveIdentity();
      window.location.reload();
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      api.post("/auth/forgot-password", data),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      api.post("/auth/reset-password", data),
    onSuccess: () => {
      addNotification("success", "Password reset successfully! Please log in.");
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (data: VerifyEmailRequest) =>
      api.post("/auth/verify-email", data),
    onSuccess: () => {
      addNotification(
        "success",
        "Email verified successfully! You can now log in.",
      );
    },
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    googleAuth: googleAuthMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    verifyEmail: verifyEmailMutation.mutateAsync,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    isGooglePending: googleAuthMutation.isPending,
    isForgotPending: forgotPasswordMutation.isPending,
    isResetPending: resetPasswordMutation.isPending,
    isVerifyPending: verifyEmailMutation.isPending,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      googleAuthMutation.isPending ||
      forgotPasswordMutation.isPending ||
      resetPasswordMutation.isPending ||
      verifyEmailMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
