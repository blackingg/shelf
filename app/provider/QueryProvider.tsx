"use client";

import { QueryClient, Query, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useMemo } from "react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import Cookies from "js-cookie";
import { useUser } from "../services/user/hooks";
import { useOpenPanel } from "@openpanel/nextjs";
import { getActiveIdentity, setActiveIdentity } from "../lib/identity";

const PERSIST_BASE_KEY = "shelf-query-cache";

// NOTE: "user" is deliberately NOT persisted. The /users/me payload contains PII
// (name, email, username); keeping it out of localStorage limits what an XSS
// payload can read at rest. It stays in the in-memory cache only.
const PERSISTED_QUERY_KEYS = [
  "categories",
  "departments",
  "discover",
  "folders",
  "books",
  "bookmarks",
  "onboarding",
];

function OpenPanelTracker() {
  const { me } = useUser();
  const openPanel = useOpenPanel();

  useEffect(() => {
    if (me) {
      // Keep the cache namespace pinned to this user (covers sessions that were
      // already active before login recorded the identity).
      setActiveIdentity(me.id);
      openPanel.identify({
        profileId: me.id,
        name: me.fullName,
        email: me.email,
        username: me.username || undefined,
      });
    }
  }, [me, openPanel]);

  return null;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const token = typeof window !== "undefined" ? Cookies.get("accessToken") : undefined;
  const isAuthenticated = !!token;

  // Namespace the persisted cache by a stable per-user identity (user id) rather
  // than the access token, which rotates on every refresh. See lib/identity.ts.
  const identity = isAuthenticated ? getActiveIdentity() : "guest";

  const currentPersistKey = `${PERSIST_BASE_KEY}-${identity}`;

  // Recreate the QueryClient only when auth state changes.
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
      <QueryClientProvider client={queryClient}>
        <OpenPanelTracker />
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
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
      <OpenPanelTracker />
      {children}
    </PersistQueryClientProvider>
  );
}
