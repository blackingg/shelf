import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";

export const departmentKeys = {
  all: ["departments"] as const,
  detail: (slug: string) => [...departmentKeys.all, "detail", slug] as const,
};

export const useGetDepartmentsQuery = (params?: any) => {
  return useQuery<any[]>({
    queryKey: params ? [...departmentKeys.all, params] : departmentKeys.all,
    queryFn: () => api.get<any[]>("/departments/", { params }),
  });
};

export const useGetDepartmentBySlugQuery = (slug: string) => {
  return useQuery<any>({
    queryKey: departmentKeys.detail(slug),
    queryFn: () => api.get<any>(`/departments/${slug}`),
    enabled: !!slug,
  });
};

export const useDepartments = (params?: any) => {
  const { data: departments = [], isLoading, isFetching, error } = useGetDepartmentsQuery(params);
  return { departments, isLoading, isFetching, error };
};

export const useGetBooksByDepartmentQuery = (slug: string, params: any) => {
  return useQuery<any>({
    queryKey: [...departmentKeys.all, "books", slug, params],
    queryFn: () => api.get<any>(`/departments/${slug}/books`, { params }),
    enabled: !!slug,
  });
};

export const useBooksByDepartment = (slug: string, params: any) => {
  const { data, isLoading, isFetching, error } = useGetBooksByDepartmentQuery(slug, params);
  
  return {
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
