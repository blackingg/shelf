import { baseApi } from "./baseApi";
import { Category, CategoryBooksParams } from "../../types/categories";
import { Book } from "../../types/book";
import { PaginatedResponse } from "../../types/common";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: ["Categories"],
      keepUnusedDataFor: 3600, // Cache for 1 hour
    }),
    getCategoryBySlug: builder.query<Category, string>({
      query: (slug) => `/categories/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Categories", id: slug }],
      keepUnusedDataFor: 300,
    }),
    getBooksByCategory: builder.query<
      PaginatedResponse<Book>,
      CategoryBooksParams
    >({
      query: ({ slug, pageSize, limit, ...params }) => ({
        url: `/categories/${slug}/books`,
        params: {
          ...params,
          ...(limit || pageSize ? { limit: limit ?? pageSize } : {}),
        },
      }),
      providesTags: ["Books"],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetBooksByCategoryQuery,
} = categoriesApi;
