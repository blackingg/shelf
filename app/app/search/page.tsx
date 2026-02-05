"use client";
import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { BookCard } from "@/app/components/Library/BookCard";
import { useRouter } from "next/navigation";
import { BookPreview } from "@/app/types/book";
import { Folder } from "@/app/types/folder";
import { FiSearch, FiArrowLeft } from "react-icons/fi";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";

type SearchResultItem =
  | (BookPreview & { type: "book" })
  | (Folder & { type: "folder" });

// Mock Data
const allFolders: Folder[] = [
  {
    id: "1",
    slug: "want-to-read",
    name: "Want to Read",
    description: "Books I want to read",
    booksCount: 12,
    bookmarksCount: 0,
    visibility: "PRIVATE",
    coverImages: ["/dummycover.png", "/dummycover.png"],
    createdBy: "You",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "favorites",
    name: "Favorites",
    description: "My favorite books",
    booksCount: 8,
    bookmarksCount: 0,
    visibility: "PRIVATE",
    coverImages: ["/dummycover.png", "/dummycover.png"],
    createdBy: "You",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    slug: "study-materials",
    name: "Study Materials",
    description: "Books for my studies",
    booksCount: 15,
    bookmarksCount: 0,
    visibility: "PUBLIC",
    coverImages: ["/dummycover.png", "/dummycover.png"],
    createdBy: "You",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    slug: "best-fiction-2024",
    name: "Best Fiction 2024",
    description: "Top fiction picks",
    booksCount: 24,
    bookmarksCount: 150,
    visibility: "PUBLIC",
    createdBy: "Sarah Johnson",
    coverImages: ["/dummycover.png", "/dummycover.png"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    slug: "tech-innovation",
    name: "Tech & Innovation",
    description: "Future gadgets",
    booksCount: 18,
    bookmarksCount: 120,
    visibility: "PUBLIC",
    createdBy: "Mike Chen",
    coverImages: ["/dummycover.png", "/dummycover.png"],
    createdAt: new Date().toISOString(),
  },
];

const allBooks: BookPreview[] = [
  {
    id: "1",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    cover_image: "/dummycover.png",
    donor_id: "sheriff",
    description:
      "Explores the timeless lessons on wealth, greed, and happiness, emphasizing behavior over finance.",
    category: "Business",
    pages: 256,
    published_year: 2020,
  },
  {
    id: "2",
    title: "How Innovation Works",
    author: "Matt Ridley",
    cover_image: "/dummycover.png",
    donor_id: "sodiq",
    description:
      "A fascinating dive into how human creativity and incremental change drive real-world innovation.",
    category: "Science",
    pages: 368,
    published_year: 2019,
  },
  {
    id: "3",
    title: "Company of One",
    author: "Paul Jarvis",
    cover_image: "/dummycover.png",
    donor_id: "pauljarvis",
    description:
      "Offers a refreshingly original business strategy focused on staying small but thriving with purpose.",
    category: "Business",
    pages: 192,
    published_year: 2019,
  },
  {
    id: "4",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover_image: "/dummycover.png",
    donor_id: "fitzgerald",
    description:
      "The quintessential Jazz Age novel that explores themes of love, ambition, and the American dream.",
    category: "Classics",
    pages: 180,
    published_year: 1925,
  },
  {
    id: "5",
    title: "The Bees",
    author: "Laline Paull",
    cover_image: "/dummycover.png",
    donor_id: "laline",
    description:
      "A brilliantly imagined dystopian story set in a hive, examining power, survival, and individuality.",
    category: "Science Fiction",
    pages: 384,
    published_year: 2014,
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);

  // This would be an API call to an endpoint
  // const { data } = useSearchQuery(query);
  const filteredBooks = allBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
  );
  const filteredFolders = allFolders.filter(
    (folder) =>
      folder.name.toLowerCase().includes(query.toLowerCase()) ||
      folder.slug.toLowerCase().includes(query.toLowerCase())
  );

  const results: SearchResultItem[] = [
    ...filteredFolders.map((f) => ({ ...f, type: "folder" as const })),
    ...filteredBooks.map((b) => ({ ...b, type: "book" as const })),
  ];

  if (!query) {
    return (
      <main className="flex-1 overflow-y-auto w-full bg-white dark:bg-neutral-900">
        <div className="p-4 md:p-8 pb-0">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-gray-600 dark:text-neutral-400"
              title="Go back"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Search
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
            <FiSearch className="w-12 h-12 text-gray-400 dark:text-neutral-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Search Shelf
          </h2>
          <p className="text-gray-500 dark:text-neutral-400 max-w-sm">
            Enter a search term to find books, authors, and folders on Shelf.
          </p>
        </div>
      </main>
    );
  }

  if (results.length === 0) {
    return (
      <main className="flex-1 overflow-y-auto w-full bg-white dark:bg-neutral-900">
        <div className="p-4 md:p-8 pb-0">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-gray-600 dark:text-neutral-400"
              title="Go back"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              No results found
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
            <FiSearch className="w-12 h-12 text-gray-400 dark:text-neutral-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No results found
          </h2>
          <p className="text-gray-500 dark:text-neutral-400 max-w-sm">
            We couldn&apos;t find any results for &quot;{query}&quot;. Try
            checking for typos or searching for something else.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto w-full bg-white dark:bg-neutral-900">
        <div className="p-4 md:p-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => router.back()}
                className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-gray-600 dark:text-neutral-400"
                title="Go back"
              >
                <FiArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Search Results
              </h1>
            </div>
            <p className="text-gray-500 dark:text-neutral-400 ml-10">
              Found {results.length}{" "}
              {results.length === 1 ? "result" : "results"} for &quot;{query}
              &quot;
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {results.map((item) => {
              if (item.type === "folder") {
                return (
                  <FolderCard
                    key={`folder-${item.id}`}
                    folder={item}
                    onClick={() => router.push(`/app/folders/${item.id}`)}
                  />
                );
              } else {
                return (
                  <BookCard
                    {...item}
                    onClick={() => setSelectedBook(item)}
                  />
                );
              }
            })}
          </div>
        </div>
      </main>

      {selectedBook && (
        <BookDetailPanel
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 overflow-y-auto w-full">
          <div className="p-4 md:p-8 animate-pulse">
            <div className="h-8 w-64 bg-gray-200 dark:bg-neutral-800 rounded mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="space-y-3"
                >
                  <div className="aspect-[2/3] bg-gray-200 dark:bg-neutral-800 rounded-xl" />
                  <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
