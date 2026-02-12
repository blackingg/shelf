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
  // Proactive refresh logic
  const state = api.getState() as RootState;
  const { expiresAt, refreshToken } = state.auth;

  // Check if token is about to expire (within 60 seconds)
  if (refreshToken && expiresAt) {
    const now = Date.now();
    // Default expiration buffer to 60 seconds
    const expirationBuffer = 60 * 1000;

    if (now > expiresAt - expirationBuffer) {
      // Token expiring soon (within 60s), try proactive refresh
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
            }
          }
        } finally {
          release();
        }
      } else {
        // Wait for the mutex to be released (refresh to complete)
        await mutex.waitForUnlock();
      }
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = (api.getState() as RootState).auth.refreshToken;

        if (refreshToken) {
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
      result = await baseQuery(args, api, extraOptions);
    }
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
