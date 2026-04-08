import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";

export const searchKeys = {
  all: ["search"] as const,
  query: (params: any) => [...searchKeys.all, params] as const,
};

export const useSearchQuery = (params: any, options?: any) => {
  return useQuery<any>({
    queryKey: searchKeys.query(params),
    queryFn: () => api.get<any>("/search", { params }),
    placeholderData: keepPreviousData,
    ...options,
  });
};
