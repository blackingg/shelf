import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { Category } from "../../types/categories";
import { Book } from "../../types/book";
import { PaginatedResponse } from "../../types/common";

export const categoryKeys = {
  all: ["categories"] as const,
  detail: (slug: string) => [...categoryKeys.all, "detail", slug] as const,
};

interface CategoryBooksResponse {
  category: Category;
  books: PaginatedResponse<Book>;
}

export const useGetCategoriesQuery = () => {
  return useQuery<Category[]>({
    queryKey: categoryKeys.all,
    queryFn: () => api.get<Category[]>("/categories/"),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
  });
};

export const useGetCategoryBySlugQuery = (slug: string) => {
  return useQuery<Category>({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => api.get<Category>(`/categories/${slug}`),
    enabled: !!slug,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
  });
};

export const useGetBooksByCategoryQuery = (slug: string, params: any) => {
  return useQuery<CategoryBooksResponse>({
    queryKey: [...categoryKeys.all, "books", slug, params],
    queryFn: () =>
      api.get<CategoryBooksResponse>(`/categories/${slug}/books`, { params }),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useBooksByCategory = (slug: string, params: any) => {
  const { data, isLoading, isFetching, error } = useGetBooksByCategoryQuery(
    slug,
    params,
  );

  return {
    category: data?.category || null,
    books: data?.books?.items || [],
    total: data?.books?.total || 0,
    totalPages: data?.books?.totalPages || 1,
    hasNext: data?.books?.hasNext || false,
    isLoading,
    isFetching,
    error,
  };
};
export const useCategories = () => {
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();
  return { categories, isLoading, error };
};

export const useCategoryBySlug = (slug: string) => {
  const { data: category, isLoading, error } = useGetCategoryBySlugQuery(slug);
  return { category, isLoading, error };
};
