import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { SearchResponse } from "../../types/search";

export const searchKeys = {
  all: ["search"] as const,
  query: (params: any) => [...searchKeys.all, params] as const,
};

export const useSearchQuery = (params: any, options?: { enabled?: boolean }) => {
  return useQuery<SearchResponse>({
    queryKey: searchKeys.query(params),
    queryFn: () => api.get<SearchResponse>("/search", { params }),
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
};
