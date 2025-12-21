"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { BookCard } from "@/app/components/Library/BookCard";
import { useRouter } from "next/navigation";
import { Book } from "@/app/types/book";
import { Folder } from "@/app/types/folder";

type SearchResultItem =
  | (Book & { type: "book" })
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

const allBooks: Book[] = [
  {
    id: "1",
    slug: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverImage: "/dummycover.png",
    rating: 4.8,
    ratingsCount: 450,
    reviewsCount: 210,
    readersCount: 1203,
    downloadsCount: 850,
    donatedBy: "Sheriff Olopade",
    donatedAt: "2024-01-15T10:00:00Z",
    description:
      "Explores the timeless lessons on wealth, greed, and happiness, emphasizing behavior over finance. ",
    category: "Business",
    pages: 256,
  },
  {
    id: "2",
    slug: "how-innovation-works",
    title: "How Innovation Works",
    author: "Matt Ridley",
    coverImage: "/dummycover.png",
    rating: 4.6,
    ratingsCount: 320,
    reviewsCount: 150,
    readersCount: 850,
    downloadsCount: 420,
    donatedBy: "Arogundade Sodiq",
    donatedAt: "2024-01-15T10:00:00Z",
    description:
      "A fascinating dive into how human creativity and incremental change drive real-world innovation.",
    category: "Science",
    pages: 368,
  },
  {
    id: "3",
    slug: "company-of-one",
    title: "Company of One",
    author: "Paul Jarvis",
    coverImage: "/dummycover.png",
    rating: 4.5,
    ratingsCount: 280,
    reviewsCount: 110,
    readersCount: 650,
    downloadsCount: 300,
    donatedBy: "Paul Jarvis",
    donatedAt: "2024-01-15T10:00:00Z",
    description:
      "Offers a refreshingly original business strategy focused on staying small but thriving with purpose.",
    category: "Business",
    pages: 192,
  },
  {
    id: "4",
    slug: "great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverImage: "/dummycover.png",
    rating: 4.4,
    ratingsCount: 950,
    reviewsCount: 312,
    readersCount: 4500,
    downloadsCount: 2100,
    donatedBy: "F. Scott Fitzgerald Estate",
    donatedAt: "2024-01-15T10:00:00Z",
    description:
      "The quintessential Jazz Age novel that explores themes of love, ambition, and the American dream.",
    category: "Classics",
    pages: 180,
  },
  {
    id: "5",
    slug: "the-bees",
    title: "The Bees",
    author: "Laline Paull",
    coverImage: "/dummycover.png",
    rating: 4.8,
    ratingsCount: 340,
    reviewsCount: 140,
    readersCount: 720,
    downloadsCount: 500,
    donatedBy: "Laline Paull",
    donatedAt: "2024-01-15T10:00:00Z",
    description:
      "A brilliantly imagined dystopian story set in a hive, examining power, survival, and individuality.",
    category: "Science Fiction",
    pages: 384,
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();

  const filteredBooks = allBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
  );
  const filteredFolders = allFolders.filter((folder) =>
    folder.name.toLowerCase().includes(query.toLowerCase())
  );

  const results: SearchResultItem[] = [
    ...filteredFolders.map((f) => ({ ...f, type: "folder" as const })),
    ...filteredBooks.map((b) => ({ ...b, type: "book" as const })),
  ];

  if (!query) {
    return (
      <div className="p-8 text-center text-gray-500">
        Please enter a search term to find books and folders.
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No results found for &quot;{query}&quot;.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Search Results for &quot;{query}&quot;
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
                key={`book-${item.id}`}
                {...item}
                onClick={() => router.push(`/app/books/${item.id}`)}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
