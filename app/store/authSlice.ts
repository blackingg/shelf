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
    const userStr = storage.get("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Failed to parse user from storage:", error);
    storage.remove("user");
    return null;
  }
};

const getExpiresAtFromStorage = (): number | null => {
  const expiresAt = storage.get("expiresAt");
  return expiresAt ? parseInt(expiresAt) : null;
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  accessToken: storage.get("accessToken"),
  refreshToken: storage.get("refreshToken"),
  expiresAt: getExpiresAtFromStorage(),
  isAuthenticated: !!storage.get("accessToken"),
  rememberMe: storage.get("rememberMe") === "true",
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

      storage.remove("user");
      storage.remove("accessToken");
      storage.remove("refreshToken");
      storage.remove("expiresAt");
      storage.remove("rememberMe");

      storage.set("user", JSON.stringify(user));
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
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (action.payload) {
        storage.set("user", JSON.stringify(action.payload));
      } else {
        storage.remove("user");
      }
    },
    setOnboardingStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.onboardingCompleted = action.payload;
        storage.set("user", JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      state.rememberMe = false;

      storage.remove("user");
      storage.remove("accessToken");
      storage.remove("refreshToken");
      storage.remove("expiresAt");
      storage.remove("rememberMe");
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
        storage.set("user", JSON.stringify(action.payload));
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
