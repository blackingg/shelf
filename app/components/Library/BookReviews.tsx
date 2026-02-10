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
}

export const BookReviews: React.FC<BookReviewsProps> = ({ bookId }) => {
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
      <div className="py-4 text-center text-sm text-emerald-200">
        Loading reviews...
      </div>
    );

  const reviews = reviewsData?.items || [];

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="relative"
      >
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write a review..."
          className="w-full bg-emerald-800/30 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-emerald-100/50 outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[100px] resize-none"
        />
        <button
          type="submit"
          disabled={isSubmitting || !newReview.trim()}
          className="absolute bottom-3 right-3 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <FiSend className="w-4 h-4" />
        </button>
      </form>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-6 text-emerald-200/50 text-sm italic">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/5 rounded-xl p-4 border border-white/5"
            >
              <div className="flex justify-between items-start mb-2">
                <Link
                  href={`/app/profile/${review.user?.username}`}
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-700 relative flex items-center justify-center text-xs font-bold shrink-0">
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
                    <h4 className="text-xs font-bold text-white">
                      {review.user?.username || "Unknown"}
                    </h4>
                    <p className="text-[10px] text-emerald-200/50">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                {currentUser?.id === review.userId && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-emerald-200/30 hover:text-red-400 transition-colors p-1"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                {review.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
