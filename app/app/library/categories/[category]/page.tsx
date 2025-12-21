"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { BookCard } from "@/app/components/Library/BookCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiArrowLeft, FiFilter } from "react-icons/fi";
import { getCategoryName } from "@/app/types/categories";
import { Book } from "@/app/types/book";

const ALL_BOOKS: Book[] = [
  {
    id: "1",
    slug: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description: "Explores the timeless lessons on wealth, greed, and happiness.",
    coverImage: "/dummycover.png",
    pages: 256,
    category: "business",
    rating: 4.8,
    ratingsCount: 450,
    reviewsCount: 210,
    readersCount: 1203,
    downloadsCount: 850,
    donatedBy: "Shelf Community",
    donatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "5",
    slug: "the-bees",
    title: "The Bees",
    author: "Laline Paull",
    description: "A brilliantly imagined dystopian story set in a hive.",
    coverImage: "/dummycover.png",
    pages: 384,
    category: "scifi",
    rating: 4.8,
    ratingsCount: 320,
    reviewsCount: 140,
    readersCount: 720,
    downloadsCount: 500,
    donatedBy: "Shelf Community",
    donatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "7",
    slug: "batman-year-one",
    title: "Batman: Year One",
    author: "Frank Miller",
    description: "An iconic comic series detailing Batman's early days.",
    coverImage: "/dummycover.png",
    pages: 200,
    category: "comics",
    rating: 4.9,
    ratingsCount: 380,
    reviewsCount: 85,
    readersCount: 950,
    downloadsCount: 600,
    donatedBy: "Shelf Community",
    donatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "8",
    slug: "watchmen",
    title: "Watchmen",
    author: "Alan Moore",
    description: "A groundbreaking graphic novel that redefined the superhero genre.",
    coverImage: "/dummycover.png",
    pages: 448,
    category: "comics",
    rating: 4.9,
    ratingsCount: 620,
    reviewsCount: 312,
    readersCount: 1850,
    downloadsCount: 1200,
    donatedBy: "Shelf Community",
    donatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "9",
    slug: "sandman-vol-1",
    title: "The Sandman Vol. 1",
    author: "Neil Gaiman",
    description: "The master of dreams embarks on an epic journey through myth and reality.",
    coverImage: "/dummycover.png",
    pages: 240,
    category: "comics",
    rating: 4.8,
    ratingsCount: 540,
    reviewsCount: 268,
    readersCount: 1420,
    downloadsCount: 900,
    donatedBy: "Shelf Community",
    donatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "10",
    slug: "saga-vol-1",
    title: "Saga Vol. 1",
    author: "Brian K. Vaughan",
    description: "An epic space opera about family, love, and war.",
    coverImage: "/dummycover.png",
    pages: 160,
    category: "comics",
    rating: 4.7,
    ratingsCount: 290,
    reviewsCount: 142,
    readersCount: 890,
    downloadsCount: 450,
    donatedBy: "Shelf Community",
    donatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "11",
    slug: "national-geographic-wildlife",
    title: "National Geographic - Wildlife Edition",
    author: "National Geographic",
    description: "Stunning photography and stories from the natural world.",
    coverImage: "/dummycover.png",
    pages: 120,
    category: "magazines",
    rating: 4.6,
    ratingsCount: 180,
    reviewsCount: 78,
    readersCount: 560,
    downloadsCount: 280,
    donatedBy: "Shelf Community",
    donatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "12",
    slug: "the-atlantic-tech",
    title: "The Atlantic - Technology & Society",
    author: "The Atlantic",
    description: "In-depth analysis of technology's impact on modern society.",
    coverImage: "/dummycover.png",
    pages: 96,
    category: "magazines",
    rating: 4.5,
    ratingsCount: 150,
    reviewsCount: 65,
    readersCount: 445,
    downloadsCount: 220,
    donatedBy: "Shelf Community",
    donatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "13",
    slug: "oau-dsa-material",
    title: "OAU Data Structures and Algorithms 2021/2022",
    author: "Department of Computer Science, OAU",
    description: "Comprehensive course material covering data structures and algorithm design.",
    coverImage: "/dummycover.png",
    pages: 320,
    category: "education",
    rating: 4.4,
    ratingsCount: 210,
    reviewsCount: 156,
    readersCount: 892,
    downloadsCount: 400,
    donatedBy: "Shelf Community",
    donatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "14",
    slug: "intro-to-ml",
    title: "Introduction to Machine Learning",
    author: "Dr. Andrew Ng",
    description: "A foundational guide to machine learning concepts and applications.",
    coverImage: "/dummycover.png",
    pages: 450,
    category: "education",
    rating: 4.7,
    ratingsCount: 480,
    reviewsCount: 234,
    readersCount: 1340,
    downloadsCount: 670,
    donatedBy: "Shelf Community",
    donatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "15",
    slug: "calculus-early-transcendentals",
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    description: "The definitive textbook for learning calculus and mathematical analysis.",
    coverImage: "/dummycover.png",
    pages: 1368,
    category: "education",
    rating: 4.5,
    ratingsCount: 650,
    reviewsCount: 387,
    readersCount: 2150,
    downloadsCount: 1070,
    donatedBy: "Shelf Community",
    donatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "16",
    slug: "physics-for-scientists",
    title: "Physics for Scientists and Engineers",
    author: "Raymond A. Serway",
    description: "A comprehensive introduction to physics principles and problem-solving.",
    coverImage: "/dummycover.png",
    pages: 1280,
    category: "education",
    rating: 4.6,
    ratingsCount: 520,
    reviewsCount: 298,
    readersCount: 1680,
    downloadsCount: 840,
    donatedBy: "Shelf Community",
    donatedAt: "2024-01-15T10:00:00Z",
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

  const sortedBooks = [...categoryBooks].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "popular":
        return (b.readersCount || 0) - (a.readersCount || 0);
      case "recent":
        return Number(b.id) - Number(a.id);
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
