"use client";

import { Provider } from "react-redux";
import { store } from "@/app/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationProvider } from "../context/NotificationContext";
import TokenRefresher from "../components/Auth/TokenRefresher";
import AuthHydrator from "../components/Auth/AuthHydrator";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <Provider store={store}>
      <AuthHydrator>
        <NotificationProvider>
          <GoogleOAuthProvider clientId={googleClientId}>
            <TokenRefresher>{children}</TokenRefresher>
          </GoogleOAuthProvider>
        </NotificationProvider>
      </AuthHydrator>
    </Provider>
  );
}
