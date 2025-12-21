import { baseApi } from "./baseApi";
import { Department, School } from "../../types/departments";
import { Book } from "../../types/book";

export const departmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      query: () => "/departments",
      providesTags: ["Departments"],
    }),
    getDepartmentBySlug: builder.query<Department, string>({
      query: (slug) => `/departments/${slug}`,
      providesTags: (result, error, slug) => [
        { type: "Departments", id: slug },
      ],
    }),
    getBooksByDepartment: builder.query<Book[], string>({
      query: (slug) => `/departments/${slug}/books`,
      providesTags: ["Books"],
    }),
    getOnboardingSchools: builder.query<School[], void>({
      query: () => "/onboarding/schools",
    }),
    getOnboardingDepartments: builder.query<Department[], string>({
      query: (schoolId) => `/onboarding/departments/${schoolId}`,
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentBySlugQuery,
  useGetBooksByDepartmentQuery,
  useGetOnboardingSchoolsQuery,
  useGetOnboardingDepartmentsQuery,
} = departmentsApi;
