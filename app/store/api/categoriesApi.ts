import { baseApi } from "./baseApi";
import { Category } from "../../types/categories";
import { Book } from "../../types/book";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    getCategoryBySlug: builder.query<Category, string>({
      query: (slug) => `/categories/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Categories", id: slug }],
    }),
    getBooksByCategory: builder.query<Book[], string>({
      query: (slug) => `/categories/${slug}/books`,
      providesTags: ["Books"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetBooksByCategoryQuery,
} = categoriesApi;
