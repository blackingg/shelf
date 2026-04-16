import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "../../store/store";
import { logout, updateTokens } from "../../store/authSlice";
import { Mutex } from "async-mutex";
import { getErrorMessage } from "../../helpers/error";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const mutex = new Mutex();

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Inject Bearer Token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.accessToken;

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
      // If we are already refreshing, wait for the mutex to unlock and retry with new token
      if (mutex.isLocked()) {
        await mutex.waitForUnlock();
        const newState = store.getState();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newState.auth.accessToken}`;
        }
        return axiosInstance(originalRequest);
      }

      originalRequest._retry = true;
      const release = await mutex.acquire();

      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;

        if (refreshToken) {
          // Use base axios to avoid infinite interceptor loops
          const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          if (refreshRes.status === 200) {
            const { accessToken, refreshToken: newRefreshToken, expiresIn } = refreshRes.data;
            
            store.dispatch(
              updateTokens({
                accessToken,
                refreshToken: newRefreshToken,
                expiresIn,
              })
            );

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return axiosInstance(originalRequest);
          }
        }
        
        // No refresh token or refresh failed
        store.dispatch(logout());
        return Promise.reject(error);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        release();
      }
    }

    // 2. Handle 403: Specific "Not authenticated" check
    const errorData = error.response?.data as any;
    if (error.response?.status === 403 && errorData?.detail === "Not authenticated") {
      store.dispatch(logout());
    }

    // 3. Process Error Message using helper
    // axiosError.response is passed to getErrorMessage which expects { data: ... }
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
