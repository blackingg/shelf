"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationProvider } from "../context/NotificationContext";

/**
 * AppProviders wraps the application with client-side providers
 * that don't depend on Redux (Google OAuth, Notifications).
 */
export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <NotificationProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        {children}
      </GoogleOAuthProvider>
    </NotificationProvider>
  );
}
