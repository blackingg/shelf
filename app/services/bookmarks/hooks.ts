import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { Book, BookmarkedStatus } from "../../types/book";
import { Folder } from "../../types/folder";
import { PaginatedResponse } from "../../types/common";
import { useNotifications } from "../../context/NotificationContext";

export const bookmarkKeys = {
  all: ["bookmarks"] as const,
  books: (params: any) => [...bookmarkKeys.all, "books", params] as const,
  folders: (params: any) => [...bookmarkKeys.all, "folders", params] as const,
  bookStatus: (bookId: string) => [...bookmarkKeys.all, "book", bookId, "status"] as const,
  folderStatus: (folderId: string) => [...bookmarkKeys.all, "folder", folderId, "status"] as const,
};

export const useGetBookmarkedBooksQuery = (params: any, options?: { enabled?: boolean }) => {
  return useQuery<PaginatedResponse<Book>>({
    queryKey: bookmarkKeys.books(params),
    queryFn: () =>
      api.get<PaginatedResponse<Book>>("/bookmarks/books", { params }),
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });
};

export const useGetBookmarkedFoldersQuery = (params: any, options?: { enabled?: boolean }) => {
  return useQuery<PaginatedResponse<Folder>>({
    queryKey: bookmarkKeys.folders(params),
    queryFn: () =>
      api.get<PaginatedResponse<Folder>>("/folders/bookmarked", { params }),
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });
};

// ── Book Bookmark Mutations (with optimistic updates) ──

export const useAddBookmarkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => api.post(`/books/${bookId}/bookmark`),
    onMutate: async (bookId) => {
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.bookStatus(bookId) });
      const previous = queryClient.getQueryData<BookmarkedStatus>(bookmarkKeys.bookStatus(bookId));
      queryClient.setQueryData<BookmarkedStatus>(bookmarkKeys.bookStatus(bookId), { bookmarked: true });
      return { previous, bookId };
    },
    onError: (_err, _bookId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(bookmarkKeys.bookStatus(context.bookId), context.previous);
      }
    },
    onSettled: (_, __, bookId) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.bookStatus(bookId) });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
};

export const useRemoveBookmarkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => api.delete(`/books/${bookId}/bookmark`),
    onMutate: async (bookId) => {
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.bookStatus(bookId) });
      const previous = queryClient.getQueryData<BookmarkedStatus>(bookmarkKeys.bookStatus(bookId));
      queryClient.setQueryData<BookmarkedStatus>(bookmarkKeys.bookStatus(bookId), { bookmarked: false });
      return { previous, bookId };
    },
    onError: (_err, _bookId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(bookmarkKeys.bookStatus(context.bookId), context.previous);
      }
    },
    onSettled: (_, __, bookId) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.bookStatus(bookId) });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
};

export const useGetIsBookBookmarkedQuery = (bookId: string) => {
  return useQuery<BookmarkedStatus>({
    queryKey: bookmarkKeys.bookStatus(bookId),
    queryFn: () =>
      api.get<BookmarkedStatus>(`/books/${bookId}/bookmarked`),
    enabled: !!bookId,
  });
};

export const useGetIsFolderBookmarkedQuery = (folderId: string) => {
  return useQuery<BookmarkedStatus>({
    queryKey: bookmarkKeys.folderStatus(folderId),
    queryFn: () =>
      api.get<BookmarkedStatus>(
        `/folders/${folderId}/bookmarked`,
      ),
    enabled: !!folderId,
  });
};

// ── Folder Bookmark Mutations (with optimistic updates) ──

export const useBookmarkFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderId: string) => api.post(`/folders/${folderId}/bookmark`),
    onMutate: async (folderId) => {
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.folderStatus(folderId) });
      const previous = queryClient.getQueryData<BookmarkedStatus>(bookmarkKeys.folderStatus(folderId));
      queryClient.setQueryData<BookmarkedStatus>(bookmarkKeys.folderStatus(folderId), { bookmarked: true });
      return { previous, folderId };
    },
    onError: (_err, _folderId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(bookmarkKeys.folderStatus(context.folderId), context.previous);
      }
    },
    onSettled: (_, __, folderId) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.folderStatus(folderId) });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
};

export const useUnbookmarkFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderId: string) =>
      api.delete(`/folders/${folderId}/bookmark`),
    onMutate: async (folderId) => {
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.folderStatus(folderId) });
      const previous = queryClient.getQueryData<BookmarkedStatus>(bookmarkKeys.folderStatus(folderId));
      queryClient.setQueryData<BookmarkedStatus>(bookmarkKeys.folderStatus(folderId), { bookmarked: false });
      return { previous, folderId };
    },
    onError: (_err, _folderId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(bookmarkKeys.folderStatus(context.folderId), context.previous);
      }
    },
    onSettled: (_, __, folderId) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.folderStatus(folderId) });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
};

// ── Domain Hooks ──

export const useBookmarkedBooks = (params: any = {}, options?: { enabled?: boolean }) => {
  const { data, isLoading, isFetching, error } =
    useGetBookmarkedBooksQuery(params, options);

  return {
    books: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    isLoading,
    isFetching,
    error,
  };
};

export const useBookmarkedFolders = (params: any = {}, options?: { enabled?: boolean }) => {
  const { data, isLoading, isFetching, error } =
    useGetBookmarkedFoldersQuery(params, options);

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
