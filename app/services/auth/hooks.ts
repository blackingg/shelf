import { useMutation } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  GoogleOAuthRequest,
} from "../../types/auth";
import { useAppDispatch } from "../../store/store";
import { setCredentials, logout } from "../../store/authSlice";
import { useNotifications } from "../../context/NotificationContext";

export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotifications();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) =>
      api.post<AuthResponse>("/auth/login", credentials),
    onSuccess: (data, variables) => {
      dispatch(
        setCredentials({
          accessToken: data.tokens.accessToken,
          refreshToken: data.tokens.refreshToken,
          userId: data.user.id,
          expiresIn: data.tokens.expiresIn,
          rememberMe: variables.rememberMe,
        }),
      );
      addNotification("success", "Welcome back!");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) =>
      api.post<AuthResponse>("/auth/register", data),
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          accessToken: data.tokens.accessToken,
          refreshToken: data.tokens.refreshToken,
          userId: data.user.id,
          expiresIn: data.tokens.expiresIn,
        }),
      );
      addNotification("success", "Account created successfully!");
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: (data: GoogleOAuthRequest) =>
      api.post<AuthResponse>("/auth/google", data),
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          accessToken: data.tokens.accessToken,
          refreshToken: data.tokens.refreshToken,
          userId: data.user.id,
          expiresIn: data.tokens.expiresIn,
          rememberMe: true,
        }),
      );
      addNotification("success", "Signed in with Google");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.post("/auth/logout", {}),
    onSettled: () => {
      dispatch(logout());
      window.location.reload();
    },
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    googleAuth: googleAuthMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    isGooglePending: googleAuthMutation.isPending,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      googleAuthMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
