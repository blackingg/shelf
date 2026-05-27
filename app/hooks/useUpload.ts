"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const AUTH_KEY = "upload_auth_session";
const EXPIRY_TIME = 1000 * 60 * 60; // 1 hour of inactivity before session expires
const ACTIVITY_THROTTLE = 1000 * 60; // Refresh session timestamp at most once per minute
const EXPIRY_CHECK_INTERVAL = 1000 * 30; // Check for expiry every 30 seconds

/**
 * A hook that manages password-protected access for upload functionality.
 * Uses a sliding session window — the session timer resets on user activity,
 * so active users are never logged out mid-work. The session only expires
 * after the full EXPIRY_TIME duration of inactivity.
 *
 * @returns An object containing:
 * - isAuthorized: Boolean indicating if the user is currently authenticated.
 * - isLoading: Boolean indicating if the authentication state is being initialized.
 * - password: The current password input value.
 * - setPassword: Function to update the password input and clear errors.
 * - error: Error message if authentication fails.
 * - authorize: Function to validate the password against environment variables and initiate a session.
 * - logout: Function to clear the current session and reset local state.
 */
export const useUpload = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const lastRefreshRef = useRef<number>(0);

  /**
   * Validates the current session stored in localStorage.
   * Checks for existence, structure, and whether the session has expired
   * due to inactivity (no user interaction for EXPIRY_TIME).
   */
  const checkAuth = useCallback(() => {
    if (typeof window === "undefined") return;

    const sessionStr = localStorage.getItem(AUTH_KEY);
    if (!sessionStr) {
      setIsAuthorized(false);
      return;
    }

    try {
      const session = JSON.parse(sessionStr);
      const now = Date.now();

      // Check if session has expired due to inactivity
      if (now - session.timestamp < EXPIRY_TIME) {
        setIsAuthorized(true);
      } else {
        localStorage.removeItem(AUTH_KEY);
        setIsAuthorized(false);
      }
    } catch (e) {
      localStorage.removeItem(AUTH_KEY);
      setIsAuthorized(false);
    }
  }, []);

  /**
   * Refreshes the session timestamp in localStorage to extend the sliding window.
   * Throttled to avoid excessive writes — updates at most once per ACTIVITY_THROTTLE interval.
   */
  const refreshSession = useCallback(() => {
    const now = Date.now();
    if (now - lastRefreshRef.current < ACTIVITY_THROTTLE) return;

    const sessionStr = localStorage.getItem(AUTH_KEY);
    if (!sessionStr) return;

    try {
      const session = JSON.parse(sessionStr);
      session.timestamp = now;
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      lastRefreshRef.current = now;
    } catch {
      // Corrupt session — let the next checkAuth handle cleanup
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Re-check on window focus to catch expiration while tab was idle
    window.addEventListener("focus", checkAuth);

    // Periodically check for expiry so stale sessions are caught
    // even without a focus event
    const expiryInterval = setInterval(checkAuth, EXPIRY_CHECK_INTERVAL);

    // Listen for user activity to refresh the sliding session window
    const activityEvents = ["mousemove", "keydown", "click", "scroll"] as const;
    activityEvents.forEach((event) =>
      window.addEventListener(event, refreshSession, { passive: true })
    );

    return () => {
      window.removeEventListener("focus", checkAuth);
      clearInterval(expiryInterval);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, refreshSession)
      );
    };
  }, [checkAuth, refreshSession]);

  /**
   * Attempts to authorize the user by comparing the local password state
   * with the application's environment-defined upload password.
   *
   * @returns {boolean} True if authorization succeeded, false otherwise.
   */
  const authorize = () => {
    if (password === process.env.NEXT_PUBLIC_UPLOAD_PASSWORD) {
      const now = Date.now();
      const session = {
        authorized: true,
        timestamp: now,
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      lastRefreshRef.current = now;
      setIsAuthorized(true);
      setError(null);
      return true;
    } else {
      setError("Incorrect access password.");
      return false;
    }
  };

  /**
   * Specialized password setter that also clears any existing error state.
   */
  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (error) setError(null);
  };

  /**
   * Terminate the session by removing the authorization token and resetting local state.
   */
  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthorized(false);
    setPassword("");
    setError(null);
  };

  return {
    isAuthorized: isAuthorized ?? false,
    isLoading: isAuthorized === null,
    password,
    setPassword: handlePasswordChange,
    error,
    authorize,
    logout,
  };
};
