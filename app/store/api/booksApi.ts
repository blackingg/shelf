import { baseApi } from "./baseApi";
import {
  Book,
  CreateBookRequest,
  UpdateBookRequest,
  BookFilterParams,
  UploadResponse,
  RecommendedBooksResponse,
} from "../../types/book";
import { PaginatedResponse } from "../../types/common";

export const booksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<PaginatedResponse<Book>, BookFilterParams>({
      query: (params) => ({
        url: "/books",
        params,
      }),
      providesTags: ["Books"],
    }),
    getRecommendedBooks: builder.query<
      RecommendedBooksResponse,
      { limit?: number } | void
    >({
      query: (params) => ({
        url: "/books/recommended",
        params: params || undefined,
      }),
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
    uploadRawFile: builder.mutation<any, FormData>({
      query: (data) => ({
        url: "/books/upload",
        method: "POST",
        body: data,
      }),
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
      },
    ),
    updateBookCover: builder.mutation<Book, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("cover_image", file);
        return {
          url: `/books/${id}/cover`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "Books",
        { type: "Books", id },
      ],
    }),
    updateBookFile: builder.mutation<Book, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("book_file", file);
        return {
          url: `/books/${id}/file`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "Books",
        { type: "Books", id },
      ],
    }),
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
  useUploadRawFileMutation,
  useUpdateBookMutation,
  useUpdateBookCoverMutation,
  useUpdateBookFileMutation,
  useDeleteBookMutation,
} = booksApi;
