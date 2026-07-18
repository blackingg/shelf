"use client";

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { Mutex } from "async-mutex";
import { getErrorMessage } from "../../helpers/error";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const mutex = new Mutex();

function getLoginPath(): string {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return "/admin/auth/login";
  }
  return "/auth/login";
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor: Read token from cookie
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("accessToken");

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Success and Errors (including 401 Refresh)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const errorData = error.response?.data as any;

    // Detect an expired/invalid access token. This backend (FastAPI HTTPBearer)
    // returns 403 "Not authenticated" for a bad token, not 401 — so both must go
    // through the refresh flow. Treating the 403 as an unrecoverable logout was
    // dropping sessions on long-lived screens (e.g. onboarding) whenever the
    // 1h access token expired, instead of transparently refreshing it.
    const isAuthFailure =
      error.response?.status === 401 ||
      (error.response?.status === 403 &&
        errorData?.detail === "Not authenticated");

    // 1. Attempt a token refresh + retry once on auth failure.
    if (isAuthFailure && !originalRequest._retry) {
      const hasToken = !!Cookies.get("accessToken");

      // If we don't even have a token, we are a guest. Just reject the error.
      if (!hasToken) {
        return Promise.reject(error);
      }

      // If we are already refreshing, wait for the mutex to unlock and retry
      if (mutex.isLocked()) {
        await mutex.waitForUnlock();
        return axiosInstance(originalRequest);
      }

      originalRequest._retry = true;
      const release = await mutex.acquire();

      try {
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
        });

        if (refreshRes.ok) {
          return axiosInstance(originalRequest);
        }

        // Refresh failed — session is truly dead, send them to login.
        Cookies.remove("accessToken");
        window.location.href = getLoginPath();
        return Promise.reject(error);
      } catch (refreshError) {
        Cookies.remove("accessToken");
        window.location.href = getLoginPath();
        return Promise.reject(refreshError);
      } finally {
        release();
      }
    }

    // 2. Process Error Message using helper
    const meaningfulMessage = getErrorMessage(error.response);
    
    // Create a new error with the meaningful message but keep original status
    const customError = new Error(meaningfulMessage);
    (customError as any).status = error.response?.status;
    (customError as any).data = error.response?.data;
    (customError as any).originalError = error;

    return Promise.reject(customError);
  }
);

/**
 * Standardized API interface for the application
 */
export const api = {
  get: <T>(url: string, config?: any) =>
    axiosInstance.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: any, config?: any) =>
    axiosInstance.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: any, config?: any) =>
    axiosInstance.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: any, config?: any) =>
    axiosInstance.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: any) =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
};

// Also export the instance for complex cases
export default axiosInstance;
