import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";

export const userKeys = {
  all: ["users"] as const,
  detail: (username: string) => [...userKeys.all, "detail", username] as const,
};

export const useGetUserByUsernameQuery = (username: string) => {
  return useQuery<any>({
    queryKey: userKeys.detail(username),
    queryFn: () => api.get<any>(`/users/username/${username}/`),
    enabled: !!username && username.length >= 2,
  });
};

export const useUserByUsername = (username: string) => {
  const { data: user, isLoading, isFetching, isError, error } = useGetUserByUsernameQuery(username);
  return { user, isLoading, isFetching, isError, error };
};
