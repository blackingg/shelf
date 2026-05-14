"use client";

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { Mutex } from "async-mutex";
import { getErrorMessage } from "../../helpers/error";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const mutex = new Mutex();

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

    // 1. Handle 401: Unauthorized (Token Expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
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

        // Refresh failed — only redirect if we were previously logged in
        Cookies.remove("accessToken");
        window.location.href = "/auth/login";
        return Promise.reject(error);
      } catch (refreshError) {
        Cookies.remove("accessToken");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        release();
      }
    }

    // 2. Handle 403: Specific "Not authenticated" check
    const errorData = error.response?.data as any;
    if (
      error.response?.status === 403 &&
      errorData?.detail === "Not authenticated" &&
      Cookies.get("accessToken") // Only redirect if they have a token that is presumably invalid
    ) {
      Cookies.remove("accessToken");
      window.location.href = "/auth/login";
    }

    // 3. Process Error Message using helper
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
