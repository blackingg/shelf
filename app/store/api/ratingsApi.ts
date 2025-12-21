import { baseApi } from "./baseApi";
import {
  Rating,
  Review,
  RateBookRequest,
  CreateReviewRequest,
  UpdateReviewRequest,
} from "../../types/ratings";

export const ratingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    rateBook: builder.mutation<Rating, RateBookRequest>({
      query: (data) => ({
        url: "/ratings/rate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { bookId }) => [
        { type: "Ratings", id: bookId },
        "Books",
      ],
    }),
    createReview: builder.mutation<Review, CreateReviewRequest>({
      query: (data) => ({
        url: "/ratings/review",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { bookId }) => [
        { type: "Ratings", id: bookId },
        "Books",
      ],
    }),
    getBookReviews: builder.query<Review[], string>({
      query: (id) => `/ratings/book/${id}`,
      providesTags: (result, error, id) => [{ type: "Ratings", id }],
    }),
    getMyRating: builder.query<Rating, string>({
      query: (id) => `/ratings/book/${id}/my-rating`,
      providesTags: (result, error, id) => [
        { type: "Ratings", id: `my-${id}` },
      ],
    }),
    updateReview: builder.mutation<
      void,
      { id: string; data: UpdateReviewRequest }
    >({
      query: ({ id, data }) => ({
        url: `/ratings/review/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Ratings"],
    }),
    deleteReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ratings/review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ratings"],
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
