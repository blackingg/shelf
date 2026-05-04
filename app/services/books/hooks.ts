import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import {
  Book,
  UpdateBookRequest,
  CreateBookRequest,
  RecommendedBooksResponse,
} from "../../types/book";
import { PaginatedResponse } from "../../types/common";
import { useNotifications } from "../../context/NotificationContext";
import { getErrorMessage } from "../../helpers/error";

export const bookKeys = {
  all: ["books"] as const,
  lists: (params: any) => [...bookKeys.all, "list", params] as const,
  detail: (id: string) => [...bookKeys.all, "detail", id] as const,
  slug: (slug: string) => [...bookKeys.all, "slug", slug] as const,
  recommended: (params: any) =>
    [...bookKeys.all, "recommended", params] as const,
  user: (username: string, params: any) =>
    ["user", username, "books", params] as const,
};

export const useGetBooksQuery = (params: any) => {
  return useQuery<PaginatedResponse<Book>>({
    queryKey: bookKeys.lists(params),
    queryFn: () => api.get<PaginatedResponse<Book>>("/books/", { params }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetBookBySlugQuery = (slug: string) => {
  return useQuery<Book>({
    queryKey: bookKeys.slug(slug),
    queryFn: () => api.get<Book>(`/books/slug/${slug}`),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetRecommendedBooksQuery = (params: any) => {
  return useQuery<RecommendedBooksResponse>({
    queryKey: bookKeys.recommended(params),
    queryFn: () =>
      api.get<RecommendedBooksResponse>("/books/recommended", { params }),
  });
};

export const useGetUserBooksQuery = (
  params: { username: string; page?: number; limit?: number },
  options?: { enabled?: boolean },
) => {
  const { username, ...queryParams } = params;
  return useQuery<PaginatedResponse<Book>>({
    queryKey: bookKeys.user(username, queryParams),
    queryFn: () =>
      api.get<PaginatedResponse<Book>>(`/users/${username}/books`, {
        params: queryParams,
      }),
    enabled: (options?.enabled ?? true) && !!username,
    placeholderData: keepPreviousData,
  });
};

export const useCreateBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookRequest) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        // Handle special cases for backend naming
        const apiKey =
          key === "coverImage"
            ? "cover_image"
            : key === "publishedYear"
              ? "published_year"
              : key;

        if (Array.isArray(value)) {
          formData.append(apiKey, value.join(","));
        } else if (value instanceof Blob) {
          formData.append(apiKey, value);
        } else {
          formData.append(apiKey, String(value));
        }
      });
      return api.post<Book>("/books/upload", formData);
    },
    onSuccess: () => {
      // New book appears in list views
      queryClient.invalidateQueries({ queryKey: ["books", "list"] });
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};

export const useUpdateBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookRequest }) =>
      api.patch<Book>(`/books/${id}`, data),
    onSuccess: (_, { id }) => {
      // Only this book's data changed
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["books", "slug"] });
    },
  });
};

export const useUpdateBookCoverMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("cover_image", file);
      return api.patch<Book>(`/books/${id}/cover`, formData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["books", "slug"] });
    },
  });
};

export const useUpdateBookFileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("book_file", file);
      return api.patch<Book>(`/books/${id}/file`, formData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["books", "slug"] });
    },
  });
};

export const useDeleteBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ success: boolean; message: string; deletedId: string }>(
        `/books/${id}`,
      ),
    onSuccess: () => {
      // Book removed — refresh lists and bookmarks
      queryClient.invalidateQueries({ queryKey: ["books", "list"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "books"] });
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};

export const useBooks = (params: any = {}) => {
  const { data, isLoading, isFetching, error } = useGetBooksQuery(params);

  return {
    books: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    isLoading,
    isFetching,
    error,
  };
};

export const useBookBySlug = (slug: string) => {
  const { data: book, isLoading, error } = useGetBookBySlugQuery(slug);

  return {
    book: book || null,
    isLoading,
    error,
  };
};

export const useRecommendedBooks = (limit?: number) => {
  const { data, isLoading, error } = useGetRecommendedBooksQuery({ limit });

  return {
    books: data?.items || [],
    isLoading,
    error,
  };
};

export const useUserBooks = (
  params: { username: string; page?: number; limit?: number },
  options?: { enabled?: boolean },
) => {
  const { data, isLoading, isFetching, error } = useGetUserBooksQuery(
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

export const useBookActions = () => {
  const { addNotification } = useNotifications();
  const createMutation = useCreateBookMutation();
  const updateMutation = useUpdateBookMutation();
  const updateCoverMutation = useUpdateBookCoverMutation();
  const updateFileMutation = useUpdateBookFileMutation();
  const deleteMutation = useDeleteBookMutation();

  return {
    actions: {
      createBook: async (data: CreateBookRequest) => {
        try {
          return await createMutation.mutateAsync(data);
        } catch (err: any) {
          addNotification(
            "error",
            getErrorMessage(err, "Failed to upload book"),
          );
          throw err;
        }
      },
      updateBook: async (id: string, data: UpdateBookRequest) => {
        try {
          return await updateMutation.mutateAsync({ id, data });
        } catch (err: any) {
          addNotification(
            "error",
            getErrorMessage(err, "Failed to update book"),
          );
          throw err;
        }
      },
      updateCover: async (id: string, file: File) => {
        try {
          return await updateCoverMutation.mutateAsync({ id, file });
        } catch (err: any) {
          addNotification(
            "error",
            getErrorMessage(err, "Failed to update cover"),
          );
          throw err;
        }
      },
      updateFile: async (id: string, file: File) => {
        try {
          return await updateFileMutation.mutateAsync({ id, file });
        } catch (err: any) {
          addNotification(
            "error",
            getErrorMessage(err, "Failed to update file"),
          );
          throw err;
        }
      },
      deleteBook: async (id: string) => {
        try {
          return await deleteMutation.mutateAsync(id);
        } catch (err: any) {
          addNotification(
            "error",
            getErrorMessage(err, "Failed to delete book"),
          );
          throw err;
        }
      },
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingCover: updateCoverMutation.isPending,
    isUpdatingFile: updateFileMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
