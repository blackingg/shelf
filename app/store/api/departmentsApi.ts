import { baseApi } from "./baseApi";
import {
  Department,
  DepartmentFilterParams,
  DepartmentBooksParams,
} from "../../types/departments";
import { Book } from "../../types/book";
import { PaginatedResponse } from "../../types/common";

export const departmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], DepartmentFilterParams | void>({
      query: (params) => ({
        url: "/departments",
        params: params || {},
      }),
      providesTags: ["Departments"],
      keepUnusedDataFor: 3600, // Cache for 1 hour
    }),
    getDepartmentBySlug: builder.query<Department, string>({
      query: (slug) => `/departments/${slug}`,
      providesTags: (result, error, slug) => [
        { type: "Departments", id: slug },
      ],
      keepUnusedDataFor: 300,
    }),
    getBooksByDepartment: builder.query<
      PaginatedResponse<Book>,
      DepartmentBooksParams
    >({
      query: ({ slug, pageSize, limit, ...params }) => ({
        url: `/departments/${slug}/books`,
        params: {
          ...params,
          ...(limit || pageSize ? { limit: limit ?? pageSize } : {}),
        },
      }),
      providesTags: (result, error, { slug }) => [
        { type: "Books", id: `dept-${slug}` },
      ],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentBySlugQuery,
  useGetBooksByDepartmentQuery,
} = departmentsApi;
