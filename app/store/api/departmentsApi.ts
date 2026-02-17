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
    }),
    getBooksByDepartment: builder.query<
      PaginatedResponse<Book>,
      DepartmentBooksParams
    >({
      query: ({ slug, ...params }) => ({
        url: `/departments/${slug}/books`,
        params,
      }),
      providesTags: (result, error, { slug }) => [
        { type: "Books", id: `dept-${slug}` },
      ],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentBySlugQuery,
  useGetBooksByDepartmentQuery,
} = departmentsApi;
