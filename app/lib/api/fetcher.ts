import { store } from "../../store/store";

import { logout, updateTokens } from "../../store/authSlice";
import { Mutex } from "async-mutex";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const mutex = new Mutex();

export interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

const isValidToken = (token: string | null | undefined): token is string =>
  !!token && token !== "undefined" && token !== "null";

export const fetcher = async <T>(
  url: string,
  { params, ...options }: FetchOptions = {},
): Promise<T> => {
  const state = store.getState();
  const { accessToken, refreshToken, expiresAt } = state.auth;

  // 1. Proactive Refresh Check
  if (isValidToken(refreshToken) && expiresAt) {
    const now = Date.now();
    const expirationBuffer = 60 * 1000; // 1 minute

    if (now > expiresAt - expirationBuffer) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const currentState = store.getState();
          if (
            currentState.auth.expiresAt &&
            now > currentState.auth.expiresAt - expirationBuffer
          ) {
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            });

            if (refreshRes.ok) {
              const data = await refreshRes.json();
              store.dispatch(
                updateTokens({
                  accessToken: data.accessToken,
                  refreshToken: data.refreshToken,
                  expiresIn: data.expiresIn,
                }),
              );
            } else {
              store.dispatch(logout());
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

  const performFetch = async (currentOptions: FetchOptions) => {
    const currentState = store.getState();
    const currentToken = currentState.auth.accessToken;

    const urlWithParams = new URL(
      `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`,
    );
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined)
          urlWithParams.searchParams.append(key, String(value));
      });
    }

    const headers = new Headers(currentOptions.headers);
    if (currentToken) headers.set("Authorization", `Bearer ${currentToken}`);
    if (
      !headers.has("Content-Type") &&
      !(currentOptions.body instanceof FormData)
    ) {
      headers.set("Content-Type", "application/json");
    }

    return fetch(urlWithParams.toString(), {
      ...currentOptions,
      headers,
    });
  };

  let response = await performFetch(options);

  // 2. Reactive Refresh (on 401)
  if (response.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const currentRefreshToken = store.getState().auth.refreshToken;
        if (isValidToken(currentRefreshToken)) {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: currentRefreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            store.dispatch(
              updateTokens({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                expiresIn: data.expiresIn,
              }),
            );
            response = await performFetch(options);
          } else {
            store.dispatch(logout());
          }
        } else {
          store.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      response = await performFetch(options);
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Force logout on specific "Not authenticated" errors
    if (response.status === 403 && errorData.detail === "Not authenticated") {
      store.dispatch(logout());
    }

    throw new Error(
      errorData.detail || errorData.message || `API error: ${response.status}`,
    );
  }

  const contentType = response.headers.get("Content-Type");
  if (contentType?.includes("application/json")) return response.json();
  return {} as T;
};

export const api = {
  get: <T>(url: string, options?: FetchOptions) =>
    fetcher<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, body?: any, options?: FetchOptions) =>
    fetcher<T>(url, { ...options, method: "POST", body: JSON.stringify(body) }),

  put: <T>(url: string, body?: any, options?: FetchOptions) =>
    fetcher<T>(url, { ...options, method: "PUT", body: JSON.stringify(body) }),

  patch: <T>(url: string, body?: any, options?: FetchOptions) =>
    fetcher<T>(url, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string, options?: FetchOptions) =>
    fetcher<T>(url, { ...options, method: "DELETE" }),
};
