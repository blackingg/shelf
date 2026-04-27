import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storage } from "../helpers/storage";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  rememberMe: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  isAuthenticated: false,
  isHydrated: false,
  rememberMe: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrate: (state) => {
      const accessToken = storage.get("accessToken");
      const refreshToken = storage.get("refreshToken");
      const expiresAt = storage.get("expiresAt");
      const rememberMe = storage.get("rememberMe") === "true";

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.expiresAt = expiresAt ? parseInt(expiresAt) : null;
      state.rememberMe = rememberMe;
      state.isAuthenticated = !!accessToken;
      state.isHydrated = true;
    },
    setCredentials: (
      state,
      {
        payload: { accessToken, refreshToken, rememberMe, expiresIn },
      }: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        rememberMe?: boolean;
      }>,
    ) => {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.expiresAt = Date.now() + expiresIn * 1000;
      state.isAuthenticated = true;
      state.rememberMe = !!rememberMe;

      storage.set("accessToken", accessToken);
      storage.set("refreshToken", refreshToken);
      storage.set("expiresAt", state.expiresAt.toString());
      storage.set("rememberMe", state.rememberMe.toString());
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      storage.set("accessToken", action.payload);
    },
    updateTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = Date.now() + action.payload.expiresIn * 1000;

      storage.set("accessToken", action.payload.accessToken);
      storage.set("refreshToken", action.payload.refreshToken);
      storage.set("expiresAt", state.expiresAt.toString());
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      state.rememberMe = false;

      storage.remove("accessToken");
      storage.remove("refreshToken");
      storage.remove("expiresAt");
      storage.remove("rememberMe");
      storage.remove("user"); // Clean up old user key if it exists
    },
  },
});

export const {
  hydrate,
  setCredentials,
  updateAccessToken,
  updateTokens,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsHydrated = (state: { auth: AuthState }) =>
  state.auth.isHydrated;

