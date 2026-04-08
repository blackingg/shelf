import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";

export const categoryKeys = {
  all: ["categories"] as const,
  detail: (slug: string) => [...categoryKeys.all, "detail", slug] as const,
};

export const useGetCategoriesQuery = () => {
  return useQuery<any[]>({
    queryKey: categoryKeys.all,
    queryFn: () => api.get<any[]>("/categories/"),
  });
};

export const useGetCategoryBySlugQuery = (slug: string) => {
  return useQuery<any>({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => api.get<any>(`/categories/${slug}`),
    enabled: !!slug,
  });
};

export const useGetBooksByCategoryQuery = (slug: string, params: any) => {
  return useQuery<any>({
    queryKey: [...categoryKeys.all, "books", slug, params],
    queryFn: () => api.get<any>(`/categories/${slug}/books`, { params }),
    enabled: !!slug,
  });
};

export const useBooksByCategory = (slug: string, params: any) => {
  const { data, isLoading, isFetching, error } = useGetBooksByCategoryQuery(slug, params);
  
  return {
    category: data?.category || null,
    books: data?.books?.items || [],
    total: data?.books?.total || 0,
    totalPages: data?.books?.totalPages || 1,
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
