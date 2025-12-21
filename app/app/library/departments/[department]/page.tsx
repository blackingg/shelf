"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { BookCard } from "@/app/components/Library/BookCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiArrowLeft, FiFilter } from "react-icons/fi";
import { getDepartmentName } from "@/app/helpers/department";
import { DEPARTMENT_BOOKS } from "@/app/data/department";
import { Book } from "@/app/types/book";

export default function DepartmentPage({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const resolvedParams = use(params);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "recent">(
    "popular"
  );
  const router = useRouter();

  const departmentName = getDepartmentName(resolvedParams.department);

  let departmentBooks =
    resolvedParams.department == "all"
      ? DEPARTMENT_BOOKS
      : DEPARTMENT_BOOKS.filter((book) =>
          book.departments.includes(resolvedParams.department)
        );

  if (searchQuery) {
    departmentBooks = departmentBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const sortedBooks = [...departmentBooks].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "popular":
        return (b.readersCount || 0) - (a.readersCount || 0);
      case "recent":
        return Number(b.id || 0) - Number(a.id || 0);
      default:
        return 0;
    }
  });

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group cursor-pointer"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="font-medium group-hover:underline">
                Back to Departments
              </span>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl capitalize font-bold text-gray-900 mb-2">
                  {departmentName}
                </h1>
                <p className="text-gray-600">
                  {sortedBooks.length}{" "}
                  {sortedBooks.length === 1 ? "book" : "books"} available
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <FiFilter className="w-5 h-5 text-gray-600" />
                <select
                  title="sortBy"
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
