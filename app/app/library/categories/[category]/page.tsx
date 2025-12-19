"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { BookCard } from "@/app/components/Library/BookCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiArrowLeft, FiFilter } from "react-icons/fi";
import { getCategoryName } from "@/app/types/categories";
import { Book } from "@/app/types/book";

const ALL_BOOKS = [
  {
    type: "book",
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverImage: "/dummycover.png",
    rating: 4.8,
    pages: 256,
    readingCount: 1203,
    reviews: 210,
    donatedBy: "Shelf Community",
    description:
      "Explores the timeless lessons on wealth, greed, and happiness.",
    category: "business",
  },
  {
    type: "book",
    id: 5,
    title: "The Bees",
    author: "Laline Paull",
    coverImage: "/dummycover.png",
    rating: 4.8,
    pages: 384,
    readingCount: 720,
    reviews: 140,
    donatedBy: "Shelf Community",
    description: "A brilliantly imagined dystopian story set in a hive.",
    category: "scifi",
  },
  {
    type: "book",
    id: 7,
    title: "Batman: Year One",
    author: "Frank Miller",
    coverImage: "/dummycover.png",
    rating: 4.9,
    pages: 200,
    readingCount: 950,
    reviews: 85,
    donatedBy: "Shelf Community",
    description: "An iconic comic series detailing Batman's early days.",
    category: "comics",
  },
  {
    type: "book",
    id: 8,
    title: "Watchmen",
    author: "Alan Moore",
    coverImage: "/dummycover.png",
    rating: 4.9,
    pages: 448,
    readingCount: 1850,
    reviews: 312,
    donatedBy: "Shelf Community",
    description:
      "A groundbreaking graphic novel that redefined the superhero genre.",
    category: "comics",
  },
  {
    type: "book",
    id: 9,
    title: "The Sandman Vol. 1",
    author: "Neil Gaiman",
    coverImage: "/dummycover.png",
    rating: 4.8,
    pages: 240,
    readingCount: 1420,
    reviews: 268,
    donatedBy: "Shelf Community",
    description:
      "The master of dreams embarks on an epic journey through myth and reality.",
    category: "comics",
  },
  {
    type: "book",
    id: 10,
    title: "Saga Vol. 1",
    author: "Brian K. Vaughan",
    coverImage: "/dummycover.png",
    rating: 4.7,
    pages: 160,
    readingCount: 890,
    reviews: 142,
    donatedBy: "Shelf Community",
    description: "An epic space opera about family, love, and war.",
    category: "comics",
  },
  {
    type: "book",
    id: 11,
    title: "National Geographic - Wildlife Edition",
    author: "National Geographic",
    coverImage: "/dummycover.png",
    rating: 4.6,
    pages: 120,
    readingCount: 560,
    reviews: 78,
    donatedBy: "Shelf Community",
    description: "Stunning photography and stories from the natural world.",
    category: "magazines",
  },
  {
    type: "book",
    id: 12,
    title: "The Atlantic - Technology & Society",
    author: "The Atlantic",
    coverImage: "/dummycover.png",
    rating: 4.5,
    pages: 96,
    readingCount: 445,
    reviews: 65,
    donatedBy: "Shelf Community",
    description: "In-depth analysis of technology's impact on modern society.",
    category: "magazines",
  },
  {
    type: "book",
    id: 13,
    title: "OAU Data Structures and Algorithms 2021/2022",
    author: "Department of Computer Science, OAU",
    coverImage: "/dummycover.png",
    rating: 4.4,
    pages: 320,
    readingCount: 892,
    reviews: 156,
    donatedBy: "Shelf Community",
    description:
      "Comprehensive course material covering data structures and algorithm design.",
    category: "education",
  },
  {
    type: "book",
    id: 14,
    title: "Introduction to Machine Learning",
    author: "Dr. Andrew Ng",
    coverImage: "/dummycover.png",
    rating: 4.7,
    pages: 450,
    readingCount: 1340,
    reviews: 234,
    donatedBy: "Shelf Community",
    description:
      "A foundational guide to machine learning concepts and applications.",
    category: "education",
  },
  {
    type: "book",
    id: 15,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    coverImage: "/dummycover.png",
    rating: 4.5,
    pages: 1368,
    readingCount: 2150,
    reviews: 387,
    donatedBy: "Shelf Community",
    description:
      "The definitive textbook for learning calculus and mathematical analysis.",
    category: "education",
  },
  {
    type: "book",
    id: 16,
    title: "Physics for Scientists and Engineers",
    author: "Raymond A. Serway",
    coverImage: "/dummycover.png",
    rating: 4.6,
    pages: 1280,
    readingCount: 1680,
    reviews: 298,
    donatedBy: "Shelf Community",
    description:
      "A comprehensive introduction to physics principles and problem-solving.",
    category: "education",
  },
];

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = use(params);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "recent">(
    "popular"
  );
  const router = useRouter();

  const categoryName = getCategoryName(resolvedParams.category);

  const categoryBooks =
    resolvedParams.category.toLowerCase() === "all"
      ? ALL_BOOKS
      : ALL_BOOKS.filter((book) => book.category === resolvedParams.category);

  // Cast categoryBooks to Book[] because ALL_BOOKS items match Book shape but inferred loosely + extra 'category' prop
  const displayBooks = categoryBooks as unknown as Book[];

  const sortedBooks = [...displayBooks].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "popular":
        return (b.readingCount || 0) - (a.readingCount || 0);
      case "recent":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="group group-hover:underline flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group cursor-pointer"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="font-medium group-hover:underline">
                Back to Categories
              </span>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {categoryName}
                </h1>
                <p className="text-gray-600">
                  {sortedBooks.length}{" "}
                  {sortedBooks.length === 1 ? "book" : "books"} available
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <FiFilter className="w-5 h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "popular" | "rating" | "recent")
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-black"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="recent">Recently Added</option>
                </select>
              </div>
            </div>
          </div>

          {sortedBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {sortedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  {...book}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No books found in this category
              </p>
            </div>
          )}
        </div>
      </div>

      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
