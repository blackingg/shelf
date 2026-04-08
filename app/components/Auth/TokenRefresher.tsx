"use client";

import { useEffect } from "react";
import { logout, updateTokens } from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

export default function TokenRefresher({
  children,
}: {
  children: React.ReactNode;
}) {
  const { expiresAt, refreshToken, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated || !refreshToken || !expiresAt) return;

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    const buffer = 60 * 1000;
    const refreshDelay = timeUntilExpiry - buffer;

    const timer = setTimeout(
      async () => {
        try {
          console.log(
            "[TokenRefresher] Triggering background token refresh...",
          );
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            },
          );

          if (res.ok) {
            const data = await res.json();
            dispatch(
              updateTokens({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                expiresIn: data.expiresIn,
              }),
            );
          } else {
            dispatch(logout());
          }
        } catch (err) {
          console.error("[TokenRefresher] Refresh failed:", err);
        }
      },
      Math.max(0, refreshDelay),
    );

    return () => clearTimeout(timer);
  }, [expiresAt, refreshToken, isAuthenticated, dispatch]);

  return <>{children}</>;
}
