import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import {
  ReadingProgress,
  UpdateReadingProgressRequest,
  MyReadingProgressResponse,
} from "../../types/progress";

export const progressKeys = {
  all: ["progress"] as const,
  lists: (params: any) => [...progressKeys.all, "list", params] as const,
  book: (bookId: string) => [...progressKeys.all, "book", bookId] as const,
  me: (params: any) => [...progressKeys.all, "me", params] as const,
};

export const useGetBookProgressQuery = (bookId: string) => {
  return useQuery<ReadingProgress>({
    queryKey: progressKeys.book(bookId),
    queryFn: () => api.get<ReadingProgress>(`/progress/book/${bookId}`),
    enabled: !!bookId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetMyProgressQuery = (
  params: { in_progress_only?: boolean } = {},
) => {
  return useQuery<MyReadingProgressResponse>({
    queryKey: progressKeys.me(params),
    queryFn: () =>
      api.get<MyReadingProgressResponse>("/progress/me", { params }),
  });
};

export const useUpdateProgressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateReadingProgressRequest) =>
      api.post<ReadingProgress>("/progress/update", data),
    onSuccess: (data) => {
      // Update the specific book progress in cache immediately
      queryClient.setQueryData(progressKeys.book(data.bookId), data);
    },
  });
};

export const useDeleteProgressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) =>
      api.delete<{ success: boolean; message: string }>(
        `/progress/book/${bookId}`,
      ),
    onSuccess: (_, bookId) => {
      queryClient.invalidateQueries({ queryKey: progressKeys.book(bookId) });
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
    },
  });
};

/**
 * High-level hook for progress actions
 */
export const useProgressActions = () => {
  const updateMutation = useUpdateProgressMutation();
  const deleteMutation = useDeleteProgressMutation();

  const actions = useMemo(
    () => ({
      updateProgress: async (data: UpdateReadingProgressRequest) => {
        try {
          return await updateMutation.mutateAsync(data);
        } catch (err: any) {
          console.error("Failed to update reading progress:", err);
          throw err;
        }
      },
      deleteProgress: async (bookId: string) => {
        try {
          const res = await deleteMutation.mutateAsync(bookId);
          return res;
        } catch (err: any) {
          console.error("Failed to reset progress:", err);
          throw err;
        }
      },
    }),
    [updateMutation.mutateAsync, deleteMutation.mutateAsync],
  );

  return {
    actions,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
