import Image from "next/image";
import { FiStar, FiBookOpen, FiX, FiBookmark } from "react-icons/fi";

export const BookDetailPanel: React.FC<{
  book: {
    title: string;
    author: string;
    coverImage: string;
    rating: number;
    totalRatings: number;
    pages: number;
    readingCount: number;
    reviews: number;
    description: string;
  };
  onClose: () => void;
  onReadNow: () => void;
}> = ({ book, onClose, onReadNow }) => (
  <>
    <div
      className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
      onClick={onClose}
    />

    <div className="fixed top-0 right-0 h-full w-96 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white p-8 flex flex-col shadow-2xl z-50 animate-slide-in">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group"
        aria-label="Close"
      >
        <FiX className="w-6 h-6 text-emerald-100 group-hover:text-white" />
      </button>
      <div className="relative aspect-[2/3] w-48 mx-auto rounded-2xl overflow-hidden shadow-2xl mb-6 ring-4 ring-emerald-700/30">
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          className="object-cover"
        />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-center leading-tight">
        {book.title}
      </h2>
      <p className="text-emerald-200 text-center mb-4 font-medium">
        {book.author}
      </p>
      <div className="flex items-center justify-center space-x-1 mb-6 bg-emerald-800/50 rounded-xl py-3 px-4">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(book.rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-emerald-600"
            }`}
          />
        ))}
        <span className="ml-2 font-bold text-lg">{book.rating}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center bg-emerald-800/40 rounded-xl py-3 px-2">
          <p className="text-2xl font-bold text-white">{book.pages}</p>
          <p className="text-xs text-emerald-200 font-medium mt-1">Pages</p>
        </div>
        <div className="text-center bg-emerald-800/40 rounded-xl py-3 px-2">
          <p className="text-2xl font-bold text-white">{book.readingCount}</p>
          <p className="text-xs text-emerald-200 font-medium mt-1">Ratings</p>
        </div>
        <div className="text-center bg-emerald-800/40 rounded-xl py-3 px-2">
          <p className="text-2xl font-bold text-white">{book.reviews}</p>
          <p className="text-xs text-emerald-200 font-medium mt-1">Reviews</p>
        </div>
      </div>
      <div className="mb-6 flex-1 flex flex-col min-h-0">
        <h3 className="text-sm font-semibold text-emerald-200 mb-2 uppercase tracking-wide">
          About this book
        </h3>
        <div className="custom-scrollbar overflow-y-auto flex-1 pr-2">
          <p className="text-sm text-emerald-100 leading-relaxed">
            {book.description}
          </p>
        </div>
      </div>
      <div className="space-y-3 mt-auto">
        <button
          onClick={onReadNow}
          className="w-full bg-white text-emerald-900 font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-emerald-50 transform hover:scale-[1.02]"
        >
          <FiBookOpen className="w-5 h-5" />
          <span>Read Now</span>
        </button>
        <button
          onClick={() => console.log("Add to folder")}
          className="w-full bg-emerald-700/50 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 border border-emerald-600/50"
        >
          <FiBookmark className="w-4 h-4" />
          <span>Add to Folder</span>
        </button>
      </div>
    </div>
  </>
);
