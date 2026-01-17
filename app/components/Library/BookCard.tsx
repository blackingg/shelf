import Image from "next/image";
import Link from "next/link";
import { FiStar } from "react-icons/fi";

export const BookCard: React.FC<{
  title: string;
  author: string;
  cover_image: string;
  rating?: number;
  donor_id?: string;
  onClick?: () => void;
  className?: string;
}> = ({
  title,
  author,
  cover_image,
  rating,
  donor_id,
  onClick,
  className = "",
}) => (
  <div
    onClick={onClick}
    className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
  >
    <div className="relative h-65 rounded-xl overflow-hidden shadow-lg mb-3">
      <Image
        src={cover_image}
        alt={title}
        fill
        className="object-cover"
      />
      {rating && (
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
          <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-white font-medium">{rating}</span>
        </div>
      )}
    </div>
    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-1 mb-1">
      {title}
    </h3>
    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{author}</p>
    {donor_id && (
      <Link
        href={`/app/profile/${donor_id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-[10px] text-emerald-600 hover:text-emerald-700 hover:underline mt-0.5 block truncate"
      >
        Donated by {donor_id}
      </Link>
    )}
  </div>
);
