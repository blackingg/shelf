import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { DiscoveryFeedResponse } from "../../types/recommendations";
import { useUser } from "../user/hooks";

export const discoverKeys = {
  all: ["discover"] as const,
  recommendations: (userId: string = "guest") =>
    [...discoverKeys.all, "recommendations", userId] as const,
};

export const useGetDiscoverFeedQuery = (options?: {
  enabled?: boolean;
  userId?: string;
  staleTime?: number;
}) => {
  return useQuery<DiscoveryFeedResponse>({
    queryKey: discoverKeys.recommendations(options?.userId),
    queryFn: () => api.get<DiscoveryFeedResponse>("/recommendations/discover"),
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 min default
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};

// --- Domain Hooks ---

export const useDiscoverFeed = (options?: { enabled?: boolean }) => {
  const { me, isHydrated } = useUser();
  const userId = me?.id || "guest";

  const { data, isLoading, error } = useGetDiscoverFeedQuery({
    ...options,
    userId,
    enabled: isHydrated && (options?.enabled ?? true),
    staleTime: 0, // Ensure we always talk to the server on mount/identity shift
  });

  return {
    recommendations: data || null,
    isLoading: !isHydrated || isLoading,
    error,
  };
};

// Re-export from categories service — Discover page should use the shared
// cache instead of maintaining duplicate query keys.
export {
  useCategories,
  useBooksByCategory as useDiscoverBooksByCategory,
} from "../categories";
