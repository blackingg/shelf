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
    }),
    getBooksByCategory: builder.query<
      PaginatedResponse<Book>,
      CategoryBooksParams
    >({
      query: ({ slug, ...params }) => ({
        url: `/categories/${slug}/books`,
        params,
      }),
      providesTags: ["Books"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetBooksByCategoryQuery,
} = categoriesApi;
