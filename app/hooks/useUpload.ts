"use client";

import { useState, useEffect, useCallback } from "react";

const AUTH_KEY = "upload_auth_session";
const EXPIRY_TIME = 1000 * 60 * 60; // 1 hour session validity

/**
 * A hook that manages password-protected access for upload functionality.
 * It provides authentication state, persistence via localStorage, and session expiry handling.
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

  /**
   * Validates the current session stored in localStorage.
   * Checks for existence, structure, and whether the 1-hour session has expired.
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
      const now = new Date().getTime();
      
      // Check if session has expired
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

  useEffect(() => {
    checkAuth();

    // Re-check on window focus to catch expiration while tab is idle
    window.addEventListener("focus", checkAuth);
    return () => window.removeEventListener("focus", checkAuth);
  }, [checkAuth]);

  /**
   * Attempts to authorize the user by comparing the local password state 
   * with the application's environment-defined upload password.
   * 
   * @returns {boolean} True if authorization succeeded, false otherwise.
   */
  const authorize = () => {
    if (password === process.env.NEXT_PUBLIC_UPLOAD_PASSWORD) {
      const session = {
        authorized: true,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
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
    logout 
  };
};
