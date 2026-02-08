import { baseApi } from "./baseApi";
import {
  RatingResponse,
  ReviewResponse,
  RateBookRequest,
  CreateReviewRequest,
  UpdateReviewRequest,
  MyRatingResponse,
} from "../../types/ratings";
import { PaginatedResponse, DeleteResponse } from "../../types/common";

export const ratingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    rateBook: builder.mutation<RatingResponse, RateBookRequest>({
      query: (data) => ({
        url: "/ratings/rate",
        method: "POST",
        body: data,
      }),
      async onQueryStarted({ bookId, rating }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          ratingsApi.util.updateQueryData("getMyRating", bookId, (draft) => {
            draft.rating = rating;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { bookId }) => [
        { type: "Ratings", id: bookId },
        "Books",
      ],
    }),
    createReview: builder.mutation<ReviewResponse, CreateReviewRequest>({
      query: (data) => ({
        url: "/ratings/review",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(
        { bookId, content },
        { dispatch, getState, queryFulfilled },
      ) {
        const state = getState() as any;
        const user = state.auth.user;

        const tempReview: ReviewResponse = {
          id: `temp-${Date.now()}`,
          userId: user?.id || "temp-user",
          bookId,
          content,
          helpful: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: user?.id || "temp-user",
            username: user?.username || "You",
            fullName: user?.fullName || "Anonymous",
            avatar: user?.avatar || null,
          },
        };

        const patchResult = dispatch(
          ratingsApi.util.updateQueryData(
            "getBookReviews",
            { bookId },
            (draft) => {
              draft.items.unshift(tempReview);
              draft.total += 1;
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { bookId }) => [
        { type: "Ratings", id: bookId },
        "Books",
      ],
    }),
    getBookReviews: builder.query<
      PaginatedResponse<ReviewResponse>,
      { bookId: string; page?: number; pageSize?: number }
    >({
      query: ({ bookId, page = 1, pageSize = 20 }) => ({
        url: `/ratings/book/${bookId}`,
        params: { page, pageSize },
      }),
      providesTags: (result, error, { bookId }) => [
        { type: "Ratings", id: bookId },
      ],
    }),
    getMyRating: builder.query<MyRatingResponse, string>({
      query: (id) => `/ratings/book/${id}/my-rating`,
      providesTags: (result, error, id) => [
        { type: "Ratings", id: `my-${id}` },
      ],
    }),
    updateReview: builder.mutation<
      ReviewResponse,
      { id: string; bookId: string; data: UpdateReviewRequest }
    >({
      query: ({ id, data }) => ({
        url: `/ratings/review/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { bookId }) => [
        { type: "Ratings", id: bookId },
      ],
    }),
    deleteReview: builder.mutation<
      DeleteResponse,
      { id: string; bookId: string }
    >({
      query: ({ id }) => ({
        url: `/ratings/review/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted({ id, bookId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          ratingsApi.util.updateQueryData(
            "getBookReviews",
            { bookId },
            (draft) => {
              const index = draft.items.findIndex((item) => item.id === id);
              if (index !== -1) {
                draft.items.splice(index, 1);
                draft.total -= 1;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { bookId }) => [
        { type: "Ratings", id: bookId },
      ],
    }),
  }),
});

export const {
  useRateBookMutation,
  useCreateReviewMutation,
  useGetBookReviewsQuery,
  useGetMyRatingQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = ratingsApi;
