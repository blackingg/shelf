"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { BookGrid } from "@/app/components/Library/BookGrid";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiArrowLeft, FiFilter } from "react-icons/fi";
import { getCategoryName } from "@/app/types/categories";

const ALL_BOOKS = [
  {
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverImage: "/dummycover.png",
    rating: 4.8,
    pages: 256,
    readingCount: 1203,
    reviews: 210,
    description:
      "Explores the timeless lessons on wealth, greed, and happiness.",
    category: "business",
  },
  {
    id: 5,
    title: "The Bees",
    author: "Laline Paull",
    coverImage: "/dummycover.png",
    rating: 4.8,
    pages: 384,
    readingCount: 720,
    reviews: 140,
    description: "A brilliantly imagined dystopian story set in a hive.",
    category: "scifi",
  },
  {
    id: 7,
    title: "Batman: Year One",
    author: "Frank Miller",
    coverImage: "/dummycover.png",
    rating: 4.9,
    pages: 200,
    readingCount: 950,
    reviews: 85,
    description: "An iconic comic series detailing Batman's early days.",
    category: "comics",
  },
  {
    id: 8,
    title: "Watchmen",
    author: "Alan Moore",
    coverImage: "/dummycover.png",
    rating: 4.9,
    pages: 448,
    readingCount: 1850,
    reviews: 312,
    description:
      "A groundbreaking graphic novel that redefined the superhero genre.",
    category: "comics",
  },
  {
    id: 9,
    title: "The Sandman Vol. 1",
    author: "Neil Gaiman",
    coverImage: "/dummycover.png",
    rating: 4.8,
    pages: 240,
    readingCount: 1420,
    reviews: 268,
    description:
      "The master of dreams embarks on an epic journey through myth and reality.",
    category: "comics",
  },
  {
    id: 10,
    title: "Saga Vol. 1",
    author: "Brian K. Vaughan",
    coverImage: "/dummycover.png",
    rating: 4.7,
    pages: 160,
    readingCount: 890,
    reviews: 142,
    description: "An epic space opera about family, love, and war.",
    category: "comics",
  },
  {
    id: 11,
    title: "National Geographic - Wildlife Edition",
    author: "National Geographic",
    coverImage: "/dummycover.png",
    rating: 4.6,
    pages: 120,
    readingCount: 560,
    reviews: 78,
    description: "Stunning photography and stories from the natural world.",
    category: "magazines",
  },
  {
    id: 12,
    title: "The Atlantic - Technology & Society",
    author: "The Atlantic",
    coverImage: "/dummycover.png",
    rating: 4.5,
    pages: 96,
    readingCount: 445,
    reviews: 65,
    description: "In-depth analysis of technology's impact on modern society.",
    category: "magazines",
  },
  {
    id: 13,
    title: "OAU Data Structures and Algorithms 2021/2022",
    author: "Department of Computer Science, OAU",
    coverImage: "/dummycover.png",
    rating: 4.4,
    pages: 320,
    readingCount: 892,
    reviews: 156,
    description:
      "Comprehensive course material covering data structures and algorithm design.",
    category: "education",
  },
  {
    id: 14,
    title: "Introduction to Machine Learning",
    author: "Dr. Andrew Ng",
    coverImage: "/dummycover.png",
    rating: 4.7,
    pages: 450,
    readingCount: 1340,
    reviews: 234,
    description:
      "A foundational guide to machine learning concepts and applications.",
    category: "education",
  },
  {
    id: 15,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    coverImage: "/dummycover.png",
    rating: 4.5,
    pages: 1368,
    readingCount: 2150,
    reviews: 387,
    description:
      "The definitive textbook for learning calculus and mathematical analysis.",
    category: "education",
  },
  {
    id: 16,
    title: "Physics for Scientists and Engineers",
    author: "Raymond A. Serway",
    coverImage: "/dummycover.png",
    rating: 4.6,
    pages: 1280,
    readingCount: 1680,
    reviews: 298,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "recent">(
    "popular"
  );
  const router = useRouter();

  const categoryName = getCategoryName(resolvedParams.category);

  let categoryBooks =
    resolvedParams.category.toLowerCase() === "all"
      ? ALL_BOOKS
      : ALL_BOOKS.filter((book) => book.category === resolvedParams.category);

  if (searchQuery) {
    categoryBooks = categoryBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const sortedBooks = [...categoryBooks].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "popular":
        return b.readingCount - a.readingCount;
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
                  onChange={(e) => setSortBy(e.target.value as any)}
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
            <BookGrid
              books={sortedBooks}
              onBookClick={setSelectedBook}
            />
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
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
