import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/user";
import { storage } from "../helpers/storage";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
}

const getUserFromStorage = (): User | null => {
  try {
    const userStr = storage.find("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Failed to parse user from storage:", error);
    storage.removeFromBoth("user");
    return null;
  }
};

const initialState: AuthState = {
  // user: JSON.parse(storage.find("user") || "null"),
  user: getUserFromStorage(),
  accessToken: storage.find("accessToken"),
  refreshToken: storage.find("refreshToken"),
  isAuthenticated: !!storage.find("accessToken"),
  rememberMe: !!storage.get("accessToken", "local"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { user, accessToken, refreshToken, rememberMe },
      }: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
        rememberMe?: boolean;
      }>
    ) => {
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.rememberMe = !!rememberMe;

      const storageType = rememberMe ? "local" : "session";

      // Clean up old storage first
      storage.removeFromBoth("user");
      storage.removeFromBoth("accessToken");
      storage.removeFromBoth("refreshToken");

      storage.set("user", JSON.stringify(user), storageType);
      storage.set("accessToken", accessToken, storageType);
      storage.set("refreshToken", refreshToken, storageType);
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      const storageType = state.rememberMe ? "local" : "session";
      storage.set("accessToken", action.payload, storageType);
    },
    updateTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      const storageType = state.rememberMe ? "local" : "session";
      storage.set("accessToken", action.payload.accessToken, storageType);
      storage.set("refreshToken", action.payload.refreshToken, storageType);
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      const storageType = state.rememberMe ? "local" : "session";
      if (action.payload) {
        storage.set("user", JSON.stringify(action.payload), storageType);
      } else {
        storage.removeFromBoth("user");
      }
    },
    setOnboardingStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.onboardingCompleted = action.payload;
        const storageType = state.rememberMe ? "local" : "session";
        storage.set("user", JSON.stringify(state.user), storageType);
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.rememberMe = false;

      storage.removeFromBoth("user");
      storage.removeFromBoth("accessToken");
      storage.removeFromBoth("refreshToken");
    },
  },
});

export const {
  setCredentials,
  updateAccessToken,
  updateTokens,
  setUser,
  setOnboardingStatus,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
