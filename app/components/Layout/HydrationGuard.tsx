"use client";

import { ReactNode, useState, useEffect } from "react";
import { useAppSelector } from "@/app/store/store";
import { selectIsHydrated } from "@/app/store/authSlice";
import { LoadingScreen } from "../Loader/LoadingScreen";

/**
 * HydrationGuard ensures that the application only renders its children
 * once both the Redux store is hydrated and the React client-side mount
 * is complete.
 *
 * This prevents SSR hydration mismatches at the root level and eliminates
 * the need for individual component "isMounted" checks.
 */
export function HydrationGuard({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const isHydrated = useAppSelector(selectIsHydrated);
  const [hasResolvedOnce, setHasResolvedOnce] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sticky resolution: once we are ready, we stay ready.
  useEffect(() => {
    if (mounted && isHydrated) {
      setHasResolvedOnce(true);
    }
  }, [mounted, isHydrated]);

  if (!hasResolvedOnce) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
