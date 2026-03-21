import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, updateTokens } from "../authSlice";
import { TokenResponse } from "../../types/auth";
import { Mutex } from "async-mutex";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const shouldForceLogout = (error: FetchBaseQueryError) => {
    const status = error.status;
    const detail = (error.data as { detail?: string } | undefined)?.detail;
    if (status === 403 && detail === "Not authenticated") return true;
    return false;
  };

  const state = api.getState() as RootState;
  const { expiresAt, refreshToken } = state.auth;

  const isValidToken = (token: string | null | undefined): token is string =>
    !!token && token !== "undefined" && token !== "null";

  if (isValidToken(refreshToken) && expiresAt) {
    const now = Date.now();
    const expirationBuffer = 60 * 1000;

    if (now > expiresAt - expirationBuffer) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const currentState = api.getState() as RootState;
          if (
            currentState.auth.expiresAt &&
            now > currentState.auth.expiresAt - expirationBuffer
          ) {
            const refreshResult = await baseQuery(
              {
                url: "/auth/refresh",
                method: "POST",
                body: { refreshToken },
              },
              api,
              extraOptions,
            );

            if (refreshResult.data) {
              const tokenResponse = refreshResult.data as TokenResponse;
              api.dispatch(
                updateTokens({
                  accessToken: tokenResponse.accessToken,
                  refreshToken: tokenResponse.refreshToken,
                  expiresIn: tokenResponse.expiresIn,
                }),
              );
            } else {
              api.dispatch(logout());
              return {
                error: {
                  status: 401,
                  data: "Proactive token refresh failed. User logged out.",
                } as FetchBaseQueryError,
              };
            }
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
      }
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const currentRefreshToken = (api.getState() as RootState).auth
          .refreshToken;

        if (isValidToken(currentRefreshToken)) {
          const refreshResult = await baseQuery(
            {
              url: "/auth/refresh",
              method: "POST",
              body: { refreshToken: currentRefreshToken },
            },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            const tokenResponse = refreshResult.data as TokenResponse;
            api.dispatch(
              updateTokens({
                accessToken: tokenResponse.accessToken,
                refreshToken: tokenResponse.refreshToken,
                expiresIn: tokenResponse.expiresIn,
              }),
            );

            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();

      const updatedState = api.getState() as RootState;
      if (updatedState.auth.accessToken) {
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  if (result.error && shouldForceLogout(result.error)) {
    api.dispatch(logout());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Books",
    "Folders",
    "Categories",
    "Departments",
    "Ratings",
    "Bookmarks",
    "Progress",
  ],
  endpoints: () => ({}),
});
