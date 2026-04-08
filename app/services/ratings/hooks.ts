import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";

export const ratingKeys = {
  all: ["ratings"] as const,
  mine: (bookId: string) => [...ratingKeys.all, "mine", bookId] as const,
  reviews: (bookId: string) => [...ratingKeys.all, "reviews", bookId] as const,
};

export const useGetMyRatingQuery = (bookId: string) => {
  return useQuery<{ rating: number }>({
    queryKey: ratingKeys.mine(bookId),
    queryFn: () => api.get<{ rating: number }>(`/ratings/book/${bookId}/my-rating`),
    enabled: !!bookId,
  });
};

export const useRateBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, rating }: { bookId: string; rating: number }) =>
      api.post(`/ratings/rate`, { bookId, rating }),
    onSuccess: (_, { bookId }) => {
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

export const useGetReviewsQuery = (bookId: string) => {
  return useQuery<any>({
    queryKey: ratingKeys.reviews(bookId),
    queryFn: () => api.get<any>(`/ratings/book/${bookId}`),
    enabled: !!bookId,
  });
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, content }: { bookId: string; content: string }) =>
      api.post(`/ratings/review`, { bookId, content }),
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.reviews(bookId) });
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string }) =>
      api.delete(`/ratings/review/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.all });
    },
  });
};

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
    await deleteMutation.mutateAsync({ reviewId });
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
