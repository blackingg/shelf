"use client";

import { useEffect } from "react";
import { useAppSelector } from "../../store/store";
import { useRefreshMutation } from "../../store/api/authApi";

export default function TokenRefresher({
  children,
}: {
  children: React.ReactNode;
}) {
  const { expiresAt, refreshToken, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    if (!isAuthenticated || !refreshToken || !expiresAt) return;

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    const buffer = 60 * 1000;
    const refreshDelay = timeUntilExpiry - buffer;

    const timer = setTimeout(
      () => {
        console.log("[TokenRefresher] Triggering background token refresh...");
        refresh({ refreshToken });
      },
      Math.max(0, refreshDelay),
    );

    return () => clearTimeout(timer);
  }, [expiresAt, refreshToken, isAuthenticated, refresh]);

  return <>{children}</>;
}
