"use client";

import { QueryClient, Query, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { useAppSelector, store } from "../store/store";
import { selectIsAuthenticated, selectIsHydrated } from "../store/authSlice";

const PERSIST_BASE_KEY = "shelf-query-cache";

const PERSISTED_QUERY_KEYS = [
  "categories",
  "departments",
  "discover",
  "folders",
  "books",
  "user",
  "bookmarks",
  "onboarding",
];

export function QueryProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isHydrated = useAppSelector(selectIsHydrated);

  // Use a stable user ID rather than a rotating access token to avoid
  // orphaning cache entries in localStorage on every token refresh.
  const identity = isAuthenticated
    ? store.getState().auth.userId || "auth"
    : "guest";

  const currentPersistKey = `${PERSIST_BASE_KEY}-${identity.substring(0, 10)}`;

  // Recreate the QueryClient only when auth state or hydration changes.
  // This fully destroys in-memory cache, active queries, and observers,
  // ensuring a clean slate for each identity context.
  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 3 * 60 * 1000,
          gcTime: 15 * 60 * 1000,
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });
  }, [isAuthenticated]);

  // Log auth state changes as a proper side effect, not inside useMemo.
  const prevAuthRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (
      isHydrated &&
      prevAuthRef.current !== null &&
      prevAuthRef.current !== isAuthenticated
    ) {
      console.log(
        "Auth state changed, QueryClient regenerated for fresh identity context.",
      );
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, isHydrated]);

  // Clean up stale identity-scoped cache keys from localStorage to prevent
  // unbounded growth as users log in and out over time.
  useEffect(() => {
    if (typeof window === "undefined") return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PERSIST_BASE_KEY) && k !== currentPersistKey)
      .forEach((k) => localStorage.removeItem(k));
  }, [currentPersistKey]);

  // Recreate the persister whenever the identity key changes.
  const persister = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return createSyncStoragePersister({
      storage: window.localStorage,
      key: currentPersistKey,
      throttleTime: 1000,
    });
  }, [currentPersistKey]);

  // Guard against SSR where localStorage and the persister are unavailable.
  if (!persister) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      key={currentPersistKey}
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000,
        dehydrateOptions: {
          shouldDehydrateQuery: (query: Query) => {
            const queryKey = query.queryKey[0] as string;
            return (
              query.state.status === "success" &&
              PERSISTED_QUERY_KEYS.includes(queryKey)
            );
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
