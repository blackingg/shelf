import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";

export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  users: (params: any) => [...adminKeys.all, "users", params] as const,
};

export const useGetAdminStatsQuery = () => {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => api.get("/admin/stats"),
  });
};

export const useAdmin = () => {
  const { data: stats, isLoading: isLoadingStats } = useGetAdminStatsQuery();

  return {
    stats,
    isLoading: isLoadingStats,
  };
};
