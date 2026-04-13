"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationProvider } from "../context/NotificationContext";
import TokenRefresher from "../components/Auth/TokenRefresher";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

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
