"use client";

import { useState, useEffect, useCallback } from "react";

const AUTH_KEY = "upload_auth_session";
const EXPIRY_TIME = 1000 * 60 * 60; // 1 hour session validity

export const useUpload = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (error) setError(null);
  };

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
