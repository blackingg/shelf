import { baseApi } from "./baseApi";
import { ProgressResponse, UpdateProgressRequest } from "../../types/progress";

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProgress: builder.mutation<void, UpdateProgressRequest>({
      query: (data) => ({
        url: "/progress/update",
        method: "POST",
        body: data,
      }),
      async onQueryStarted({ bookId, currentPage, totalPages }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          progressApi.util.updateQueryData("getBookProgress", bookId, (draft) => {
            draft.currentPage = currentPage;
            draft.totalPages = totalPages;
            draft.percentage = Math.round((currentPage / totalPages) * 100);
            draft.lastRead = new Date().toISOString();
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { bookId }) => [
        { type: "Progress", id: bookId },
      ],
    }),
    getBookProgress: builder.query<ProgressResponse, string>({
      query: (id) => `/progress/book/${id}`,
      providesTags: (result, error, id) => [{ type: "Progress", id }],
    }),
    getMyProgress: builder.query<ProgressResponse[], void>({
      query: () => "/progress/me",
      providesTags: ["Progress"],
    }),
    deleteProgress: builder.mutation<void, string>({
      query: (id) => ({
        url: `/progress/book/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Progress", id }],
    }),
  }),
});

export const {
  useUpdateProgressMutation,
  useGetBookProgressQuery,
  useGetMyProgressQuery,
  useDeleteProgressMutation,
} = progressApi;
