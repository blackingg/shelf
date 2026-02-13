"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationProvider } from "../context/NotificationContext";
import { useState, useEffect } from "react";
import { LoadingScreen } from "../components/LoadingScreen";
import TokenRefresher from "../components/Auth/TokenRefresher";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <NotificationProvider>
        <GoogleOAuthProvider clientId={googleClientId}>
          <TokenRefresher>{children}</TokenRefresher>
        </GoogleOAuthProvider>
      </NotificationProvider>
    </Provider>
  );
}
