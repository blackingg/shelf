import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { MyRatingResponse, ReviewResponse, RateBookRequest } from "../../types/ratings";
import { PaginatedResponse } from "../../types/common";

export const ratingKeys = {
  all: ["ratings"] as const,
  mine: (bookId: string) => [...ratingKeys.all, "mine", bookId] as const,
  reviews: (bookId: string) => [...ratingKeys.all, "reviews", bookId] as const,
};

export const useGetMyRatingQuery = (bookId: string) => {
  return useQuery<MyRatingResponse>({
    queryKey: ratingKeys.mine(bookId),
    queryFn: () => api.get<MyRatingResponse>(`/ratings/book/${bookId}/my-rating`),
    enabled: !!bookId,
  });
};

// ── Star Rating (optimistic) ──

export const useRateBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, rating }: RateBookRequest) =>
      api.post(`/ratings/rate`, { bookId, rating }),
    onMutate: async ({ bookId, rating }) => {
      await queryClient.cancelQueries({ queryKey: ratingKeys.mine(bookId) });
      const previous = queryClient.getQueryData<MyRatingResponse>(ratingKeys.mine(bookId));
      queryClient.setQueryData<MyRatingResponse>(ratingKeys.mine(bookId), { rating });
      return { previous, bookId };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(ratingKeys.mine(context.bookId), context.previous);
      }
    },
    onSettled: (_, __, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.mine(bookId) });
      queryClient.invalidateQueries({ queryKey: ["books", "detail", bookId] });
      queryClient.invalidateQueries({ queryKey: ["books", "slug"] });
    },
  });
};

export const useMyRating = (bookId: string) => {
  const { data, isLoading } = useGetMyRatingQuery(bookId);
  return { rating: data?.rating ?? 0, isLoading };
};

export const useRatingActions = () => {
  const rateMutation = useRateBookMutation();

  const rateBook = async (bookId: string, rating: number) => {
    try {
      await rateMutation.mutateAsync({ bookId, rating });
    } catch (err) {
      console.error("Failed to rate book:", err);
    }
  };

  return {
    rateBook,
    isRating: rateMutation.isPending,
  };
};

// ── Reviews (optimistic create) ──

export const useGetReviewsQuery = (bookId: string) => {
  return useQuery<PaginatedResponse<ReviewResponse>>({
    queryKey: ratingKeys.reviews(bookId),
    queryFn: () => api.get<PaginatedResponse<ReviewResponse>>(`/ratings/book/${bookId}`),
    enabled: !!bookId,
  });
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, content }: { bookId: string; content: string }) =>
      api.post<ReviewResponse>(`/ratings/review`, { bookId, content }),
    onMutate: async ({ bookId, content }) => {
      await queryClient.cancelQueries({ queryKey: ratingKeys.reviews(bookId) });
      const previous = queryClient.getQueryData<PaginatedResponse<ReviewResponse>>(ratingKeys.reviews(bookId));

      // Optimistically insert a placeholder review at the top
      if (previous) {
        const optimisticReview: ReviewResponse = {
          id: `temp-${Date.now()}`,
          userId: "",
          bookId,
          content,
          helpful: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: { id: "", username: "You", fullName: "", avatar: null },
        };
        queryClient.setQueryData<PaginatedResponse<ReviewResponse>>(
          ratingKeys.reviews(bookId),
          {
            ...previous,
            items: [optimisticReview, ...previous.items],
            total: previous.total + 1,
          },
        );
      }
      return { previous, bookId };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(ratingKeys.reviews(context.bookId), context.previous);
      }
    },
    onSettled: (_, __, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.reviews(bookId) });
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, bookId }: { reviewId: string; bookId?: string }) =>
      api.delete(`/ratings/review/${reviewId}`),
    onMutate: async ({ reviewId, bookId }) => {
      if (!bookId) return {};
      await queryClient.cancelQueries({ queryKey: ratingKeys.reviews(bookId) });
      const previous = queryClient.getQueryData<PaginatedResponse<ReviewResponse>>(ratingKeys.reviews(bookId));

      // Optimistically remove the review
      if (previous) {
        queryClient.setQueryData<PaginatedResponse<ReviewResponse>>(
          ratingKeys.reviews(bookId),
          {
            ...previous,
            items: previous.items.filter((r) => r.id !== reviewId),
            total: Math.max(0, previous.total - 1),
          },
        );
      }
      return { previous, bookId };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined && context?.bookId) {
        queryClient.setQueryData(ratingKeys.reviews(context.bookId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.all });
    },
  });
};

// ── Combined Domain Hook ──

export const useRatings = (bookId: string) => {
  const { data, isLoading: isLoadingReviews } = useGetReviewsQuery(bookId);
  const { rating: myRating, isLoading: isLoadingRating } = useMyRating(bookId);
  
  const createMutation = useCreateReviewMutation();
  const deleteMutation = useDeleteReviewMutation();
  const { rateBook: baseRateBook, isRating } = useRatingActions();

  const createReview = async (content: string) => {
    await createMutation.mutateAsync({ bookId, content });
  };

  const deleteReview = async (reviewId: string) => {
    await deleteMutation.mutateAsync({ reviewId, bookId });
  };

  const rateBook = async (rating: number) => {
    await baseRateBook(bookId, rating);
  };

  return {
    reviews: data?.items || [],
    isLoading: isLoadingReviews || isLoadingRating,
    myRating,
    actions: {
      createReview,
      deleteReview,
      rateBook,
      isSubmittingReview: createMutation.isPending,
      isDeletingReview: deleteMutation.isPending,
      isRating,
    },
  };
};
