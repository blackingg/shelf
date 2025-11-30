import Image from "next/image";
import { FiStar } from "react-icons/fi";

export const BookCard: React.FC<{
  title: string;
  author: string;
  coverImage: string;
  rating?: number;
  onClick?: () => void;
  className?: string;
}> = ({ title, author, coverImage, rating, onClick, className = "" }) => (
  <div
    onClick={onClick}
    className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
  >
    <div className="relative h-65 rounded-xl overflow-hidden shadow-lg mb-3">
      <Image
        src={coverImage}
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
    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
      {title}
    </h3>
    <p className="text-xs text-gray-500 line-clamp-1">{author}</p>
  </div>
);
