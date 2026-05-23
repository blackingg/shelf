import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { PaginatedResponse } from "../../types/common";
import {
  FlagWithContentResponse,
  ResolveFlagRequest,
  SetBookStatusRequest,
} from "../../types/admin";
import { Book } from "../../types/book";

export const moderationKeys = {
  all: ["moderation"] as const,
  flags: (type: "books" | "folders", reviewed?: boolean) =>
    [...moderationKeys.all, "flags", type, { reviewed }] as const,
  pending: () => [...moderationKeys.all, "pending"] as const,
};

export const useGetFlaggedContentQuery = (
  type: "books" | "folders",
  params: { reviewed?: boolean; page?: number; limit?: number } = {},
) => {
  const reviewed = params.reviewed ?? false;
  return useQuery({
    queryKey: [...moderationKeys.flags(type, reviewed), params],
    queryFn: () =>
      api.get<PaginatedResponse<FlagWithContentResponse>>(
        `/moderation/flags/${type}`,
        {
          params,
        },
      ),
  });
};

export const useGetPendingBooksQuery = (
  params: { page?: number; limit?: number } = {},
) => {
  return useQuery({
    queryKey: [...moderationKeys.pending(), params],
    queryFn: () =>
      api.get<PaginatedResponse<Book>>("/moderation/books/pending", {
        params,
      }),
  });
};

export const useResolveFlagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      flagId,
      action,
      note,
    }: { flagId: string } & ResolveFlagRequest) =>
      api.patch(`/moderation/flags/${flagId}/resolve`, { action, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.all });
    },
  });
};

export const useSetBookStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookId,
      status,
      reason,
    }: { bookId: string } & SetBookStatusRequest) =>
      api.patch(`/moderation/books/${bookId}/status`, { status, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.all });
    },
  });
};

export const useModeration = () => {
  const resolveFlag = useResolveFlagMutation();
  const setBookStatus = useSetBookStatusMutation();

  return {
    actions: {
      resolveFlag: resolveFlag.mutateAsync,
      setBookStatus: setBookStatus.mutateAsync,
      isResolving: resolveFlag.isPending,
      isSettingStatus: setBookStatus.isPending,
    },
  };
};
