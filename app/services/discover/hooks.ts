import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";

export const discoverKeys = {
  all: ["discover"] as const,
  recommendations: () => [...discoverKeys.all, "recommendations"] as const,
  categories: () => [...discoverKeys.all, "categories"] as const,
  categoryBooks: (slug: string, params?: any) => [...discoverKeys.all, "categoryBooks", slug, params] as const,
};

export const useGetDiscoverFeedQuery = () => {
  return useQuery<any>({
    queryKey: discoverKeys.recommendations(),
    queryFn: () => api.get<any>("/recommendations/discover"),
  });
};

export const useGetCategoriesQuery = () => {
  return useQuery<any[]>({
    queryKey: discoverKeys.categories(),
    queryFn: () => api.get<any[]>("/categories"),
  });
};

export const useGetBooksByCategoryQuery = (slug: string, params?: any) => {
  return useQuery<any>({
    queryKey: discoverKeys.categoryBooks(slug, params),
    queryFn: () => api.get<any>(`/categories/${slug}/books`, { params }),
    enabled: !!slug,
  });
};

// --- Domain Hooks ---

export const useDiscoverFeed = () => {
  const { data, isLoading, error } = useGetDiscoverFeedQuery();
  
  return {
    recommendations: data || null,
    isLoading,
    error
  };
};

export const useCategories = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  
  return {
    categories: categories || [],
    isLoading
  };
};

export const useBooksByCategory = (slug: string, params?: any) => {
  const { data, isLoading, isFetching, error } = useGetBooksByCategoryQuery(slug, params);
  
  return {
    books: data?.books?.items || [],
    total: data?.books?.total || 0,
    hasNext: data?.books?.hasNext || false,
    isLoading,
    isFetching,
    error
  };
};
