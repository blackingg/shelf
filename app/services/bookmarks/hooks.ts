import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { Book } from "../../types/book";
import { Folder } from "../../types/folder";
import { PaginatedResponse } from "../../types/common";
import { useNotifications } from "../../context/NotificationContext";

export const bookmarkKeys = {
  all: ["bookmarks"] as const,
  books: (params: any) => [...bookmarkKeys.all, "books", params] as const,
  folders: (params: any) => [...bookmarkKeys.all, "folders", params] as const,
};

export const useGetBookmarkedBooksQuery = (params: any, options?: any) => {
  return useQuery<PaginatedResponse<Book>>({
    queryKey: bookmarkKeys.books(params),
    queryFn: () =>
      api.get<PaginatedResponse<Book>>("/bookmarks/books", { params }),
    ...options,
  });
};

export const useGetBookmarkedFoldersQuery = (params: any, options?: any) => {
  return useQuery<PaginatedResponse<Folder>>({
    queryKey: bookmarkKeys.folders(params),
    queryFn: () =>
      api.get<PaginatedResponse<Folder>>("/folders/bookmarked", { params }),
    ...options,
  });
};

export const useAddBookmarkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => api.post(`/books/${bookId}/bookmark`),
    onSuccess: (_, bookId) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({
        queryKey: [...bookmarkKeys.all, "book", bookId, "status"],
      });
    },
  });
};

export const useRemoveBookmarkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => api.delete(`/books/${bookId}/bookmark`),
    onSuccess: (_, bookId) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({
        queryKey: [...bookmarkKeys.all, "book", bookId, "status"],
      });
    },
  });
};

export const useGetIsBookBookmarkedQuery = (bookId: string) => {
  return useQuery<{ bookmarked: boolean }>({
    queryKey: [...bookmarkKeys.all, "book", bookId, "status"],
    queryFn: () =>
      api.get<{ bookmarked: boolean }>(`/books/${bookId}/bookmarked`),
    enabled: !!bookId,
  });
};

export const useGetIsFolderBookmarkedQuery = (folderId: string) => {
  return useQuery<{ bookmarked: boolean }>({
    queryKey: [...bookmarkKeys.all, "folder", folderId, "status"],
    queryFn: () =>
      api.get<{ bookmarked: boolean }>(
        `/folders/${folderId}/bookmarked`,
      ),
    enabled: !!folderId,
  });
};

export const useBookmarkFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderId: string) => api.post(`/folders/${folderId}/bookmark`),
    onSuccess: (_, folderId) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({
        queryKey: [...bookmarkKeys.all, "folder", folderId, "status"],
      });
    },
  });
};

export const useUnbookmarkFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderId: string) =>
      api.delete(`/folders/${folderId}/bookmark`),
    onSuccess: (_, folderId) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({
        queryKey: [...bookmarkKeys.all, "folder", folderId, "status"],
      });
    },
  });
};

export const useBookmarkedBooks = (params: any = {}) => {
  const { data, isLoading, isFetching, error } =
    useGetBookmarkedBooksQuery(params);

  return {
    books: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    isLoading,
    isFetching,
    error,
  };
};

export const useBookmarkedFolders = (params: any = {}) => {
  const { data, isLoading, isFetching, error } =
    useGetBookmarkedFoldersQuery(params);

  return {
    folders: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    isLoading,
    isFetching,
    error,
  };
};

export const useIsFolderBookmarked = (folderId: string) => {
  const { data, isLoading } = useGetIsFolderBookmarkedQuery(folderId);
  return { isBookmarked: data?.bookmarked || false, isLoading };
};

export const useBookmarkFolderActions = () => {
  const { addNotification } = useNotifications();
  const bookmarkMutation = useBookmarkFolderMutation();
  const unbookmarkMutation = useUnbookmarkFolderMutation();

  const toggleBookmark = async (folderId: string, isBookmarked: boolean) => {
    try {
      if (isBookmarked) {
        await unbookmarkMutation.mutateAsync(folderId);
        addNotification("success", "Removed from bookmarks");
      } else {
        await bookmarkMutation.mutateAsync(folderId);
        addNotification("success", "Added to bookmarks");
      }
    } catch (err: any) {
      addNotification("error", err.message || "Failed to update bookmark");
    }
  };

  return {
    toggleBookmark,
    isBookmarking: bookmarkMutation.isPending,
    isUnbookmarking: unbookmarkMutation.isPending,
  };
};

export const useIsBookBookmarked = (bookId: string) => {
  const { data, isLoading } = useGetIsBookBookmarkedQuery(bookId);
  return { isBookmarked: data?.bookmarked || false, isLoading };
};

export const useBookBookmarkActions = () => {
  const { addNotification } = useNotifications();
  const addMutation = useAddBookmarkMutation();
  const removeMutation = useRemoveBookmarkMutation();

  const toggleBookmark = async (bookId: string, isBookmarked: boolean) => {
    try {
      if (isBookmarked) {
        await removeMutation.mutateAsync(bookId);
        addNotification("success", "Removed from bookmarks");
      } else {
        await addMutation.mutateAsync(bookId);
        addNotification("success", "Added to bookmarks");
      }
    } catch (err: any) {
      addNotification("error", err.message || "Failed to update bookmark");
    }
  };

  return {
    toggleBookmark,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};
