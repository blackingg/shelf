import { baseApi } from "./baseApi";
import {
  Book,
  CreateBookRequest,
  UpdateBookRequest,
  BookFilterParams,
  UploadResponse,
} from "../../types/book";

export const booksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<Book[], BookFilterParams>({
      query: (params) => ({
        url: "/books",
        params,
      }),
      providesTags: ["Books"],
    }),
    getRecommendedBooks: builder.query<Book[], void>({
      query: () => "/books/recommended",
      providesTags: ["Books"],
    }),
    getBookById: builder.query<Book, string>({
      query: (id) => `/books/${id}`,
      providesTags: (result, error, id) => [{ type: "Books", id }],
    }),
    getBookBySlug: builder.query<Book, string>({
      query: (slug) => `/books/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Books", id: slug }],
    }),
    createBook: builder.mutation<Book, CreateBookRequest>({
      query: (data) => ({
        url: "/books",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Books"],
    }),
    uploadBook: builder.mutation<UploadResponse, FormData>({
      query: (data) => ({
        url: "/books/upload",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Books"],
    }),
    updateBook: builder.mutation<void, { id: string; data: UpdateBookRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/books/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [
          "Books",
          { type: "Books", id },
        ],
      }
    ),
    deleteBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Books"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetRecommendedBooksQuery,
  useGetBookByIdQuery,
  useGetBookBySlugQuery,
  useCreateBookMutation,
  useUploadBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi;
