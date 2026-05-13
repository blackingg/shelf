import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import {
  GlobalSearchResponse,
  TypeSpecificSearchResponse,
  SearchParams,
} from "../../types/search";

export const searchKeys = {
  all: ["search"] as const,
  global: (params: SearchParams) =>
    [...searchKeys.all, "global", params] as const,
  type: (type: string, params: SearchParams) =>
    [...searchKeys.all, type, params] as const,
};

export const useSearchQuery = (
  params: SearchParams,
  options?: { enabled?: boolean },
) => {
  return useQuery<GlobalSearchResponse>({
    queryKey: searchKeys.global(params),
    queryFn: () =>
      api.get<GlobalSearchResponse>("/search", {
        params,
        paramsSerializer: { indexes: null },
      }),
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
};

export const useSearchTypeQuery = <T>(
  type: "books" | "folders" | "users",
  params: SearchParams,
  options?: { enabled?: boolean },
) => {
  return useQuery<TypeSpecificSearchResponse<T>>({
    queryKey: searchKeys.type(type, params),
    queryFn: () =>
      api.get<TypeSpecificSearchResponse<T>>(`/search/${type}`, {
        params,
        paramsSerializer: { indexes: null },
      }),
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
};
