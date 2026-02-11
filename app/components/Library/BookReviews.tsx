import React, { useState } from "react";
import {
  useGetBookReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} from "@/app/store/api/ratingsApi";
import { useNotifications } from "@/app/context/NotificationContext";
import { FiMessageSquare, FiTrash2, FiSend } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store/authSlice";

interface BookReviewsProps {
  bookId: string;
  limit?: number;
  hideForm?: boolean;
}

export const BookReviews: React.FC<BookReviewsProps> = ({
  bookId,
  limit,
  hideForm = false,
}) => {
  const { data: reviewsData, isLoading } = useGetBookReviewsQuery({ bookId });
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const { addNotification } = useNotifications();
  const currentUser = useSelector(selectCurrentUser);
  const [newReview, setNewReview] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    try {
      await createReview({ bookId, content: newReview }).unwrap();
      setNewReview("");
    } catch (err) {
      // Error handled by optimistic update undo
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview({ id: reviewId, bookId }).unwrap();
    } catch (err) {
      // Error handled by optimistic update undo
    }
  };

  if (isLoading)
    return (
      <div className="py-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-emerald-400/50">
        Loading reviews...
      </div>
    );

  let reviews = reviewsData?.items || [];
  const totalReviews = reviews.length;
  if (limit) {
    reviews = reviews.slice(0, limit);
  }

  return (
    <div className="space-y-6">
      {!hideForm && (
        <form
          onSubmit={handleSubmit}
          className="relative"
        >
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write a review..."
            className="w-full bg-gray-50 dark:bg-emerald-900/20 border border-gray-200 dark:border-emerald-800/50 rounded-md px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-emerald-100/30 outline-none focus:border-emerald-500/50 min-h-[80px] resize-none transition-colors"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newReview.trim()}
            className="absolute bottom-3 right-3 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors disabled:opacity-50"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </form>
      )}

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="text-center py-6 text-gray-400 dark:text-emerald-100/30 text-xs italic font-medium">
            No reviews yet.
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-emerald-900/10 rounded-md p-4 border border-gray-100 dark:border-emerald-800/30"
            >
              <div className="flex justify-between items-start mb-3">
                <Link
                  href={`/app/profile/${review.user?.username}`}
                  className="flex items-center space-x-3 transition-opacity hover:opacity-80"
                >
                  <div className="w-7 h-7 rounded-md overflow-hidden bg-gray-100 dark:bg-emerald-800 relative flex items-center justify-center text-[10px] font-bold shrink-0 border border-gray-200 dark:border-emerald-700/50 text-gray-600 dark:text-emerald-100">
                    {review.user?.avatar &&
                    (review.user.avatar.startsWith("/") ||
                      review.user.avatar.startsWith("http")) ? (
                      <Image
                        src={review.user.avatar}
                        alt={review.user.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      review.user?.username?.charAt(0).toUpperCase() || "?"
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-900 dark:text-white leading-none mb-1">
                      @{review.user?.username || "user"}
                    </h4>
                    <p className="text-[9px] text-gray-400 dark:text-emerald-400 font-bold uppercase tracking-wider opacity-60">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                {currentUser?.id === review.userId && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-gray-400 dark:text-emerald-500/30 hover:text-red-500 transition-colors p-1"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-emerald-100/90 leading-relaxed font-medium">
                {review.content}
              </p>
            </div>
          ))
        )}

        {limit && totalReviews > limit && (
          <div className="pt-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400/60">
              And {totalReviews - limit} more reviews
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
