import React from "react";
import { FiStar } from "react-icons/fi";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
  size?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  onRate,
  interactive = false,
  size = 20,
  className = "",
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const isFilled =
          hoverRating !== null ? starValue <= hoverRating : starValue <= rating;
        const isHalf = !isFilled && starValue - 0.5 <= (hoverRating ?? rating);

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            onClick={() => interactive && onRate?.(starValue)}
            className={`${interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}`}
          >
            <FiStar
              size={size}
              className={`${
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : isHalf
                    ? "fill-yellow-400/50 text-yellow-400"
                    : "text-gray-300 dark:text-neutral-600"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
