"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryFilter } from "@/app/components/Library/CategoryFilter";
import { BookCard, BookCardSkeleton } from "@/app/components/Library/BookCard";
import {
  FolderCard,
  FolderCardSkeleton,
} from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiBook, FiArrowRight } from "react-icons/fi";
import { BookPreview } from "@/app/types/book";
import { Folder } from "@/app/types/folder";
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
    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-950 overflow-y-auto">
      <main className="p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                Discover
              </h2>
            </div>

            {isLoadingRecommendations ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                <FolderCardSkeleton count={2} />
                <BookCardSkeleton count={2} />
              </div>
            ) : displayItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
                {displayItems.map((item, idx) => {
                  if (item.type === "folder") {
                    return (
                      <FolderCard
                        key={`rec-folder-${item.id}-${idx}`}
                        folder={item}
                        onClick={() => router.push(`/app/folders/${item.slug}`)}
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
              <div className="bg-gray-50/30 dark:bg-neutral-900/10 p-16 rounded-md border border-gray-100 dark:border-neutral-800/50 text-center">
                <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-md flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-neutral-700/50">
                  <FiBook className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Recommendations Yet
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 max-w-xs mx-auto">
                  Start exploring to get personalized suggestions.
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                Categories
              </h2>
            </div>

            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {isCategoryLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12">
                <BookCardSkeleton count={5} />
              </div>
            ) : categoryBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-12">
                {categoryBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    {...book}
                    onClick={() => setSelectedBook(book as BookPreview)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50/30 dark:bg-neutral-900/10 p-24 rounded-md text-center border border-gray-100 dark:border-neutral-800/50 mt-12">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  No resources found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
