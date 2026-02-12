import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/user";
import { storage } from "../helpers/storage";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
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

const getExpiresAtFromStorage = (): number | null => {
  const expiresAt = storage.find("expiresAt");
  return expiresAt ? parseInt(expiresAt) : null;
};

const initialState: AuthState = {
  // user: JSON.parse(storage.find("user") || "null"),
  user: getUserFromStorage(),
  accessToken: storage.find("accessToken"),
  refreshToken: storage.find("refreshToken"),
  expiresAt: getExpiresAtFromStorage(),
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
        payload: { user, accessToken, refreshToken, rememberMe, expiresIn },
      }: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        rememberMe?: boolean;
      }>,
    ) => {
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.expiresAt = Date.now() + expiresIn * 1000;
      state.isAuthenticated = true;
      state.rememberMe = !!rememberMe;

      const storageType = rememberMe ? "local" : "session";

      // Clean up old storage first
      storage.removeFromBoth("user");
      storage.removeFromBoth("accessToken");
      storage.removeFromBoth("refreshToken");
      storage.removeFromBoth("expiresAt");

      storage.set("user", JSON.stringify(user), storageType);
      storage.set("accessToken", accessToken, storageType);
      storage.set("refreshToken", refreshToken, storageType);
      storage.set("expiresAt", state.expiresAt.toString(), storageType);
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      const storageType = state.rememberMe ? "local" : "session";
      storage.set("accessToken", action.payload, storageType);
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
      const storageType = state.rememberMe ? "local" : "session";
      storage.set("accessToken", action.payload.accessToken, storageType);
      storage.set("refreshToken", action.payload.refreshToken, storageType);
      storage.set("expiresAt", state.expiresAt.toString(), storageType);
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
      state.expiresAt = null;
      state.isAuthenticated = false;
      state.rememberMe = false;

      storage.removeFromBoth("user");
      storage.removeFromBoth("accessToken");
      storage.removeFromBoth("refreshToken");
      storage.removeFromBoth("expiresAt");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) =>
        action.type.endsWith("/fulfilled") &&
        ["getMe", "updateMe", "uploadAvatar"].includes(
          action.meta?.arg?.endpointName,
        ),
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        const storageType = state.rememberMe ? "local" : "session";
        storage.set("user", JSON.stringify(action.payload), storageType);
      },
    );
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
