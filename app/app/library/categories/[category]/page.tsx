"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { BookCard } from "@/app/components/Library/BookCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiArrowLeft, FiFilter } from "react-icons/fi";
import { getCategoryName } from "@/app/types/categories";
import { BookPreview } from "@/app/types/book";

const ALL_BOOKS: BookPreview[] = [
  {
    id: "1",
    donor_id: "randoRandal",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description:
      "Explores the timeless lessons on wealth, greed, and happiness.",
    category: "business",
    cover_image: "/dummycover.png",
    pages: 256,
    published_year: 2020,
  },
  {
    id: "2",
    donor_id: "randoRandal",
    title: "The Bees",
    author: "Laline Paull",
    description: "A brilliantly imagined dystopian story set in a hive.",
    category: "scifi",
    cover_image: "/dummycover.png",
    pages: 384,
    published_year: 2014,
  },
  {
    id: "3",
    donor_id: "randoRandal",
    title: "Batman: Year One",
    author: "Frank Miller",
    description: "An iconic comic series detailing Batman's early days.",
    category: "comics",
    cover_image: "/dummycover.png",
    pages: 200,
    published_year: 1987,
  },
  {
    id: "4",
    donor_id: "randoRandal",
    title: "OAU Data Structures and Algorithms 2021/2022",
    author: "Department of Computer Science, OAU",
    description:
      "Comprehensive course material covering data structures and algorithm design.",
    category: "education",
    cover_image: "/dummycover.png",
    pages: 320,
    published_year: 2022,
  },
  {
    id: "5",
    donor_id: "randoRandal",
    title: "Clean Code",
    author: "Robert C. Martin",
    description:
      "A handbook of agile software craftsmanship with practical advice on writing clean, maintainable code.",
    category: "education",
    cover_image: "/dummycover.png",
    pages: 464,
    published_year: 2008,
  },
  {
    id: "6",
    donor_id: "randoRandal",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    description:
      "A brief history of humankind from the Stone Age to the modern age.",
    category: "history",
    cover_image: "/dummycover.png",
    pages: 443,
    published_year: 2011,
  },
  {
    id: "7",
    donor_id: "randoRandal",
    title: "The Lean Startup",
    author: "Eric Ries",
    description:
      "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
    category: "business",
    cover_image: "/dummycover.png",
    pages: 336,
    published_year: 2011,
  },
  {
    id: "8",
    donor_id: "randoRandal",
    title: "1984",
    author: "George Orwell",
    description:
      "A dystopian social science fiction novel and cautionary tale about totalitarianism.",
    category: "scifi",
    cover_image: "/dummycover.png",
    pages: 328,
    published_year: 1949,
  },
];

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = use(params);
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [sortBy, setSortBy] = useState<"title" | "author" | "year">("title");
  const router = useRouter();

  const categoryName = getCategoryName(resolvedParams.category);

  const categoryBooks =
    resolvedParams.category.toLowerCase() === "all"
      ? ALL_BOOKS
      : ALL_BOOKS.filter((book) => book.category === resolvedParams.category);

  const sortedBooks = [...categoryBooks].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "author":
        return a.author.localeCompare(b.author);
      case "year":
        return (b.published_year || 0) - (a.published_year || 0);
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
                    setSortBy(e.target.value as "title" | "author" | "year")
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-black"
                >
                  <option value="title">Title (A-Z)</option>
                  <option value="author">Author (A-Z)</option>
                  <option value="year">Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {sortedBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {sortedBooks.map((book) => (
                <BookCard
                  {...book}
                  onClick={() => setSelectedBook(book)}
                key={book.id}/>
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
