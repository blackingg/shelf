import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { Book, BookmarkedStatus } from "../../types/book";
import { Folder } from "../../types/folder";
import { PaginatedResponse } from "../../types/common";
import { useNotifications } from "../../context/NotificationContext";
import { getErrorMessage } from "../../helpers/error";
import { useAppSelector, store } from "../../store/store";
import { selectIsAuthenticated } from "../../store/authSlice";

export const bookmarkKeys = {
  all: ["bookmarks"] as const,
  books: (params: any, isAuthenticated: boolean = true) =>
    [
      ...bookmarkKeys.all,
      "books",
      { ...params, authenticated: isAuthenticated },
    ] as const,
  folders: (params: any, isAuthenticated: boolean = true) =>
    [
      ...bookmarkKeys.all,
      "folders",
      { ...params, authenticated: isAuthenticated },
    ] as const,
  bookStatus: (bookId: string, isAuthenticated: boolean = true) =>
    [
      ...bookmarkKeys.all,
      "book",
      bookId,
      "status",
      { authenticated: isAuthenticated },
    ] as const,
  folderStatus: (folderId: string, isAuthenticated: boolean = true) =>
    [
      ...bookmarkKeys.all,
      "folder",
      folderId,
      "status",
      { authenticated: isAuthenticated },
    ] as const,
};

export const useGetBookmarkedBooksQuery = (
  params: any,
  options?: { enabled?: boolean },
) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery<PaginatedResponse<Book>>({
    queryKey: bookmarkKeys.books(params, isAuthenticated),
    queryFn: () =>
      api.get<PaginatedResponse<Book>>("/bookmarks/books", { params }),
    enabled: options?.enabled ?? isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useGetBookmarkedFoldersQuery = (
  params: any,
  options?: { enabled?: boolean },
) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery<PaginatedResponse<Folder>>({
    queryKey: bookmarkKeys.folders(params, isAuthenticated),
    queryFn: () =>
      api.get<PaginatedResponse<Folder>>("/folders/bookmarked", { params }),
    enabled: options?.enabled ?? isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

// ── Book Bookmark Mutations (with optimistic updates) ──

export const useAddBookmarkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => api.post(`/books/${bookId}/bookmark`),
    onMutate: async (bookId) => {
      const isAuthenticated = store.getState().auth.isAuthenticated;
      await queryClient.cancelQueries({
        queryKey: bookmarkKeys.bookStatus(bookId, isAuthenticated),
      });
      const previous = queryClient.getQueryData<BookmarkedStatus>(
        bookmarkKeys.bookStatus(bookId, isAuthenticated),
      );
      queryClient.setQueryData<BookmarkedStatus>(
        bookmarkKeys.bookStatus(bookId, isAuthenticated),
        { bookmarked: true },
      );
      return { previous, bookId, isAuthenticated };
    },
    onError: (_err, _bookId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          bookmarkKeys.bookStatus(context.bookId, context.isAuthenticated),
          context.previous,
        );
      }
    },
    onSettled: (_, __, bookId) => {
      const isAuthenticated = store.getState().auth.isAuthenticated;
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.bookStatus(bookId, isAuthenticated),
      });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
};

export const useRemoveBookmarkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => api.delete(`/books/${bookId}/bookmark`),
    onMutate: async (bookId) => {
      const isAuthenticated = store.getState().auth.isAuthenticated;
      await queryClient.cancelQueries({
        queryKey: bookmarkKeys.bookStatus(bookId, isAuthenticated),
      });
      const previous = queryClient.getQueryData<BookmarkedStatus>(
        bookmarkKeys.bookStatus(bookId, isAuthenticated),
      );
      queryClient.setQueryData<BookmarkedStatus>(
        bookmarkKeys.bookStatus(bookId, isAuthenticated),
        { bookmarked: false },
      );
      return { previous, bookId, isAuthenticated };
    },
    onError: (_err, _bookId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          bookmarkKeys.bookStatus(context.bookId, context.isAuthenticated),
          context.previous,
        );
      }
    },
    onSettled: (_, __, bookId) => {
      const isAuthenticated = store.getState().auth.isAuthenticated;
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.bookStatus(bookId, isAuthenticated),
      });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
};

export const useGetIsBookBookmarkedQuery = (
  bookId: string,
  options?: { enabled?: boolean },
) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery<BookmarkedStatus>({
    queryKey: bookmarkKeys.bookStatus(bookId, isAuthenticated),
    queryFn: () => api.get<BookmarkedStatus>(`/books/${bookId}/bookmarked`),
    enabled: !!bookId && (options?.enabled ?? isAuthenticated),
    ...options,
  });
};

export const useGetIsFolderBookmarkedQuery = (
  folderId: string,
  options?: { enabled?: boolean },
) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery<BookmarkedStatus>({
    queryKey: bookmarkKeys.folderStatus(folderId, isAuthenticated),
    queryFn: () => api.get<BookmarkedStatus>(`/folders/${folderId}/bookmarked`),
    enabled: !!folderId && (options?.enabled ?? isAuthenticated),
    ...options,
  });
};

// ── Folder Bookmark Mutations (with optimistic updates) ──

export const useBookmarkFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderId: string) => api.post(`/folders/${folderId}/bookmark`),
    onMutate: async (folderId) => {
      const isAuthenticated = store.getState().auth.isAuthenticated;
      await queryClient.cancelQueries({
        queryKey: bookmarkKeys.folderStatus(folderId, isAuthenticated),
      });
      const previous = queryClient.getQueryData<BookmarkedStatus>(
        bookmarkKeys.folderStatus(folderId, isAuthenticated),
      );
      queryClient.setQueryData<BookmarkedStatus>(
        bookmarkKeys.folderStatus(folderId, isAuthenticated),
        { bookmarked: true },
      );
      return { previous, folderId, isAuthenticated };
    },
    onError: (_err, _folderId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          bookmarkKeys.folderStatus(context.folderId, context.isAuthenticated),
          context.previous,
        );
      }
    },
    onSettled: (_, __, folderId) => {
      const isAuthenticated = store.getState().auth.isAuthenticated;
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.folderStatus(folderId, isAuthenticated),
      });
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
      const isAuthenticated = store.getState().auth.isAuthenticated;
      await queryClient.cancelQueries({
        queryKey: bookmarkKeys.folderStatus(folderId, isAuthenticated),
      });
      const previous = queryClient.getQueryData<BookmarkedStatus>(
        bookmarkKeys.folderStatus(folderId, isAuthenticated),
      );
      queryClient.setQueryData<BookmarkedStatus>(
        bookmarkKeys.folderStatus(folderId, isAuthenticated),
        { bookmarked: false },
      );
      return { previous, folderId, isAuthenticated };
    },
    onError: (_err, _folderId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          bookmarkKeys.folderStatus(context.folderId, context.isAuthenticated),
          context.previous,
        );
      }
    },
    onSettled: (_, __, folderId) => {
      const isAuthenticated = store.getState().auth.isAuthenticated;
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.folderStatus(folderId, isAuthenticated),
      });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
};

// ── Domain Hooks ──

export const useBookmarkedBooks = (
  params: any = {},
  options?: { enabled?: boolean },
) => {
  const { data, isLoading, isFetching, error } = useGetBookmarkedBooksQuery(
    params,
    options,
  );

  return {
    books: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    isLoading,
    isFetching,
    error,
  };
};

export const useBookmarkedFolders = (
  params: any = {},
  options?: { enabled?: boolean },
) => {
  const { data, isLoading, isFetching, error } = useGetBookmarkedFoldersQuery(
    params,
    options,
  );

  return {
    folders: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    isLoading,
    isFetching,
    error,
  };
};

export const useIsFolderBookmarked = (
  folderId: string,
  options?: { enabled?: boolean },
) => {
  const { data, isLoading } = useGetIsFolderBookmarkedQuery(folderId, options);
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
      addNotification(
        "error",
        getErrorMessage(err, "Failed to update bookmark"),
      );
    }
  };

  return {
    toggleBookmark,
    isBookmarking: bookmarkMutation.isPending,
    isUnbookmarking: unbookmarkMutation.isPending,
  };
};

export const useIsBookBookmarked = (
  bookId: string,
  options?: { enabled?: boolean },
) => {
  const { data, isLoading } = useGetIsBookBookmarkedQuery(bookId, options);
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
      addNotification(
        "error",
        getErrorMessage(err, "Failed to update bookmark"),
      );
    }
  };

  return {
    toggleBookmark,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};
