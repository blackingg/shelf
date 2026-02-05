"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryFilter } from "@/app/components/Library/CategoryFilter";
import { BookCard } from "@/app/components/Library/BookCard";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import {
  // FiChevronRight,
  FiBook,
} from "react-icons/fi";
import { BookPreview } from "@/app/types/book";
import { Folder } from "@/app/types/folder";
import FolderCardSkeleton from "@/app/components/Skeletons/FolderCardSkeleton";
import BookCardSkeleton from "@/app/components/Skeletons/BookCardSkeleton";
import { useGetRecommendationsCombinedQuery } from "@/app/store/api/recommendationsApi";

type RecommendedItem =
  | (BookPreview & { type: "book" })
  | (Folder & { type: "folder" });

export default function LibraryPage() {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  // const [isLoadingRecommendations]=useState(true);
  const { data: recommendations, isLoading: isLoadingRecommendations } =
    useGetRecommendationsCombinedQuery();

  const categoryBooks: BookPreview[] = [
    {
      id: "5",
      title: "The Bees",
      donor_id: "laline",
      author: "Laline Paull",
      cover_image: "/dummycover.png",
      pages: 384,
      category: "fiction",
      description:
        "A brilliantly imagined dystopian story set in a hive, examining power, survival, and individuality.",
      published_year: 2014,
    },
    {
      id: "6",
      title: "Vogue: September Issue 2024",
      donor_id: "vogue",
      author: "Vogue Magazine",
      cover_image: "/dummycover.png",
      pages: 250,
      category: "magazines",
      description:
        "The ultimate fashion guide for the season, featuring trends, style editorials, and celebrity interviews.",
      published_year: 2024,
    },
    {
      id: "7",
      title: "Batman: Year One (Full Run)",
      donor_id: "frankmiller",
      author: "Frank Miller & David Mazzucchelli",
      cover_image: "/dummycover.png",
      pages: 200,
      category: "comics",
      description:
        "An iconic comic series detailing Batman's early days, his struggle with crime in Gotham, and defining his legacy.",
      published_year: 1987,
    },
    {
      id: "8",
      title: "The Room",
      donor_id: "jonas",
      author: "Jonas Karlsson",
      cover_image: "/dummycover.png",
      pages: 220,
      category: "fiction",
      description:
        "A surreal novel exploring loneliness, imagination, and the boundaries of reality in modern life.",
      published_year: 2014,
    },
    {
      id: "9",
      title: "Norwegian Wood",
      donor_id: "murakami",
      author: "Haruki Murakami",
      cover_image: "/dummycover.png",
      pages: 368,
      category: "fiction",
      description:
        "A poignant coming-of-age story about love, loss, and personal transformation in 1960s Japan.",
      published_year: 1987,
    },
  ];

  // Combine and shuffle items for display
  const displayItems: RecommendedItem[] = [];
  if (recommendations) {
    const { books = [], folders = [] } = recommendations;
    const maxLength = Math.max(books.length, folders.length);
    for (let i = 0; i < maxLength; i++) {
      if (i < folders.length)
        displayItems.push({ ...folders[i], type: "folder" });
      if (i < books.length) displayItems.push({ ...books[i], type: "book" });
    }
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-4 md:p-8">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Recommended
              </h2>
              {/* <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                <span>See All</span>
                <FiChevronRight className="w-4 h-4" />
              </button> */}
            </div>
            {isLoadingRecommendations ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                <FolderCardSkeleton count={2} />
                <BookCardSkeleton count={2} />
              </div>
            ) : displayItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {displayItems.map((item) => {
                  if (item.type === "folder") {
                    return (
                      <FolderCard
                        key={item.id}
                        folder={item}
                        onClick={() => router.push(`/app/folders/${item.id}`)}
                      />
                    );
                  } else {
                    return (
                      <BookCard
                        key={item.id}
                        {...item}
                        onClick={() => setSelectedBook(item)}
                      />
                    );
                  }
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center mb-6">
                  <FiBook className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  No Recommendations Yet
                </h3>
                <p className="text-gray-500 dark:text-neutral-400 text-center text-sm max-w-xs">
                  Start exploring books and folders to get personalized
                  suggestions tailored just for you.
                </p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Categories
            </h2>
            <CategoryFilter />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
              {categoryBooks.map((book) => (
                <BookCard
                  key={book.id}
                  {...book}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
