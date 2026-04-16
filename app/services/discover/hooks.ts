import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { Category } from "../../types/categories";
import { DiscoveryFeedResponse } from "../../types/recommendations";
import { Book } from "../../types/book";
import { PaginatedResponse } from "../../types/common";

export const discoverKeys = {
  all: ["discover"] as const,
  recommendations: () => [...discoverKeys.all, "recommendations"] as const,
  categories: () => [...discoverKeys.all, "categories"] as const,
  categoryBooks: (slug: string, params?: any) => [...discoverKeys.all, "categoryBooks", slug, params] as const,
};

interface CategoryBooksResponse {
  category: Category;
  books: PaginatedResponse<Book>;
}

export const useGetDiscoverFeedQuery = () => {
  return useQuery<DiscoveryFeedResponse>({
    queryKey: discoverKeys.recommendations(),
    queryFn: () => api.get<DiscoveryFeedResponse>("/recommendations/discover"),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGetDiscoverCategoriesQuery = () => {
  return useQuery<Category[]>({
    queryKey: discoverKeys.categories(),
    queryFn: () => api.get<Category[]>("/categories"),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetDiscoverBooksByCategoryQuery = (slug: string, params?: any) => {
  return useQuery<CategoryBooksResponse>({
    queryKey: discoverKeys.categoryBooks(slug, params),
    queryFn: () => api.get<CategoryBooksResponse>(`/categories/${slug}/books`, { params }),
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

export const useDiscoverCategories = () => {
  const { data: categories, isLoading } = useGetDiscoverCategoriesQuery();
  
  return {
    categories: categories || [],
    isLoading
  };
};

export const useDiscoverBooksByCategory = (slug: string, params?: any) => {
  const { data, isLoading, isFetching, error } = useGetDiscoverBooksByCategoryQuery(slug, params);
  
  return {
    books: data?.books?.items || [],
    total: data?.books?.total || 0,
    hasNext: data?.books?.hasNext || false,
    isLoading,
    isFetching,
    error
  };
};
