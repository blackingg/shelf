import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { Department } from "../../types/departments";
import { Book } from "../../types/book";
import { PaginatedResponse } from "../../types/common";

export const departmentKeys = {
  all: ["departments"] as const,
  detail: (slug: string) => [...departmentKeys.all, "detail", slug] as const,
};

interface DepartmentBooksResponse {
  department: Department;
  books: PaginatedResponse<Book>;
}

export const useGetDepartmentsQuery = (params?: any) => {
  return useQuery<Department[]>({
    queryKey: params ? [...departmentKeys.all, params] : departmentKeys.all,
    queryFn: () => api.get<Department[]>("/departments/", { params }),
    staleTime: 10 * 60 * 1000, // 10 minutes — departments rarely change
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetDepartmentBySlugQuery = (slug: string) => {
  return useQuery<Department>({
    queryKey: departmentKeys.detail(slug),
    queryFn: () => api.get<Department>(`/departments/${slug}`),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useDepartments = (params?: any) => {
  const { data: departments = [], isLoading, isFetching, error } = useGetDepartmentsQuery(params);
  return { departments, isLoading, isFetching, error };
};

export const useGetBooksByDepartmentQuery = (slug: string, params: any) => {
  return useQuery<DepartmentBooksResponse>({
    queryKey: [...departmentKeys.all, "books", slug, params],
    queryFn: () => api.get<DepartmentBooksResponse>(`/departments/${slug}/books`, { params }),
    enabled: !!slug,
    placeholderData: keepPreviousData,
  });
};

export const useBooksByDepartment = (slug: string, params: any) => {
  const { data, isLoading, isFetching, error } = useGetBooksByDepartmentQuery(slug, params);
  
  return {
    data,
    books: data?.books?.items || [],
    total: data?.books?.total || 0,
    totalPages: data?.books?.totalPages || 1,
    isLoading,
    isFetching,
    error,
  };
};

export const useDepartmentBySlug = (slug: string) => {
  const { data: department, isLoading, error } = useGetDepartmentBySlugQuery(slug);
  return { department, isLoading, error };
};
