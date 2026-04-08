import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { Book, UpdateBookRequest } from "../../types/book";
import { useNotifications } from "../../context/NotificationContext";

export const bookKeys = {
  all: ["books"] as const,
  lists: (params: any) => [...bookKeys.all, "list", params] as const,
  detail: (id: string) => [...bookKeys.all, "detail", id] as const,
  slug: (slug: string) => [...bookKeys.all, "slug", slug] as const,
  recommended: (params: any) => [...bookKeys.all, "recommended", params] as const,
  user: (username: string, params: any) => ["user", username, "books", params] as const,
};

export const useGetBooksQuery = (params: any) => {
  return useQuery<any>({
    queryKey: bookKeys.lists(params),
    queryFn: () => api.get<any>("/books/", { params }),
  });
};

export const useGetBookBySlugQuery = (slug: string) => {
  return useQuery<Book>({
    queryKey: bookKeys.slug(slug),
    queryFn: () => api.get<Book>(`/books/slug/${slug}`),
    enabled: !!slug,
  });
};

export const useGetRecommendedBooksQuery = (params: any) => {
  return useQuery<Book[]>({
    queryKey: bookKeys.recommended(params),
    queryFn: () => api.get<Book[]>("/books/recommended", { params }),
  });
};

export const useGetUserBooksQuery = (params: { username: string; page?: number; limit?: number }) => {
  const { username, ...queryParams } = params;
  return useQuery<any>({
    queryKey: bookKeys.user(username, queryParams),
    queryFn: () => api.get<any>(`/users/${username}/books`, { params: queryParams }),
    enabled: !!username,
  });
};

export const useCreateBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => api.post<Book>("/books/upload", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
    },
  });
};

export const useUpdateBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookRequest }) =>
      api.patch<Book>(`/books/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
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
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
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
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
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
    books: data || [],
    isLoading,
    error,
  };
};

export const useUserBooks = (params: { username: string; page?: number; limit?: number }) => {
  const { data, isLoading, isFetching, error } = useGetUserBooksQuery(params);
  
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
  
  return {
    actions: {
      createBook: async (data: FormData) => {
        try {
          return await createMutation.mutateAsync(data);
        } catch (err: any) {
          addNotification("error", err.message || "Failed to upload book");
          throw err;
        }
      },
      updateBook: async (id: string, data: UpdateBookRequest) => {
        try {
          return await updateMutation.mutateAsync({ id, data });
        } catch (err: any) {
          addNotification("error", err.message || "Failed to update book");
          throw err;
        }
      },
      updateCover: async (id: string, file: File) => {
        try {
          return await updateCoverMutation.mutateAsync({ id, file });
        } catch (err: any) {
          addNotification("error", err.message || "Failed to update cover");
          throw err;
        }
      },
      updateFile: async (id: string, file: File) => {
        try {
          return await updateFileMutation.mutateAsync({ id, file });
        } catch (err: any) {
          addNotification("error", err.message || "Failed to update file");
          throw err;
        }
      },
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingCover: updateCoverMutation.isPending,
    isUpdatingFile: updateFileMutation.isPending,
  };
};
