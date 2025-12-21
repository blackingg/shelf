import { baseApi } from "./baseApi";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  GoogleOAuthRequest,
  RefreshTokenRequest,
  TokenResponse,
} from "../../types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    googleAuth: builder.mutation<AuthResponse, GoogleOAuthRequest>({
      query: (data) => ({
        url: "/auth/google",
        method: "POST",
        body: data,
      }),
    }),
    refresh: builder.mutation<TokenResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: "/auth/refresh",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleAuthMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;
