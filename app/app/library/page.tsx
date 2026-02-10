"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryFilter } from "@/app/components/Library/CategoryFilter";
import { BookCard } from "@/app/components/Library/BookCard";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiBook, FiArrowRight } from "react-icons/fi";
import { BookPreview } from "@/app/types/book";
import { Folder } from "@/app/types/folder";
import FolderCardSkeleton from "@/app/components/Skeletons/FolderCardSkeleton";
import BookCardSkeleton from "@/app/components/Skeletons/BookCardSkeleton";
import { useGetDiscoverFeedQuery } from "@/app/store/api/recommendationsApi";
import { useGetBooksQuery } from "@/app/store/api/booksApi";

type RecommendedItem =
  | (BookPreview & { type: "book" })
  | (Folder & { type: "folder" });

export default function LibraryPage() {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: recommendations, isLoading: isLoadingRecommendations } =
    useGetDiscoverFeedQuery();

  const {
    data: categoryBooksResponse,
    isLoading: isLoadingCategoryBooks,
    isFetching: isFetchingCategoryBooks,
  } = useGetBooksQuery({
    category: activeCategory === "all" ? undefined : activeCategory,
    pageSize: 8,
  });

  const isCategoryLoading = isLoadingCategoryBooks || isFetchingCategoryBooks;

  const categoryBooks = categoryBooksResponse?.items || [];
  const displayItems: RecommendedItem[] = [];

  if (recommendations) {
    const folders = recommendations.items
      .filter((item) => item.type === "folder")
      .map((item) => ({ ...item.data, type: "folder" as const }));

    const books = recommendations.items
      .filter((item) => item.type === "book")
      .map((item) => ({ ...item.data, type: "book" as const }));

    const maxLength = Math.max(folders.length, books.length);
    for (let i = 0; i < maxLength; i++) {
      if (i < folders.length) displayItems.push(folders[i]);
      if (i < books.length) displayItems.push(books[i]);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-neutral-900 overflow-y-auto">
      <main className="p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Recommended
              </h2>
            </div>

            {isLoadingRecommendations ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                <FolderCardSkeleton count={2} />
                <BookCardSkeleton count={2} />
              </div>
            ) : displayItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {displayItems.map((item, idx) => {
                  if (item.type === "folder") {
                    return (
                      <FolderCard
                        key={`rec-folder-${item.id}-${idx}`}
                        folder={item}
                        onClick={() => router.push(`/app/folders/${item.id}`)}
                      />
                    );
                  } else {
                    return (
                      <BookCard
                        key={`rec-book-${item.id}-${idx}`}
                        {...item}
                        onClick={() => setSelectedBook(item)}
                      />
                    );
                  }
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-800 p-12 rounded-[3rem] border border-gray-100 dark:border-neutral-700 text-center">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiBook className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Recommendations Yet
                </h3>
                <p className="text-gray-500 dark:text-neutral-400 mb-6">
                  Start exploring to get personalized suggestions.
                </p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Categories
            </h2>

            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {isCategoryLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10">
                <BookCardSkeleton count={5} />
              </div>
            ) : categoryBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-10">
                {categoryBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    {...book}
                    onClick={() => setSelectedBook(book as BookPreview)}
                    className="hover:-translate-y-2 transition-transform duration-300"
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-800 p-20 rounded-[3rem] text-center border border-gray-100 dark:border-neutral-700 mt-10">
                <p className="text-gray-500 dark:text-neutral-400 font-medium">
                  No resources found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BookDetailPanel
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
