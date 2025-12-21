"use client";
import { useState, useMemo } from "react";
import { BookCard } from "@/app/components/Library/BookCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import { FiFilter } from "react-icons/fi";
import { getDepartmentName } from "@/app/helpers/department";
import { DEPARTMENT_BOOKS } from "@/app/data/department";

export default function UserDepartmentBooks({
  params,
}: {
  params: { department: string };
}) {
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [sortBy, setSortBy] = useState<"title" | "author" | "year" | "pages">(
    "title"
  );
  const departmentName = getDepartmentName(params.department);
  console.log(params.department);

  const departmentBooks = useMemo(() => {
    return params.department === "all"
      ? DEPARTMENT_BOOKS
      : DEPARTMENT_BOOKS.filter(
          (book) => book.department === params.department
        );
  }, [params.department]);

  const sortedBooks = useMemo(() => {
    return [...departmentBooks].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "year":
          return (b.published_year ?? 0) - (a.published_year ?? 0);
        case "pages":
          return (b.pages ?? 0) - (a.pages ?? 0);
        default:
          return 0;
      }
    });
  }, [departmentBooks, sortBy]);

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
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
                  <option value="title">Title (A-Z)</option>
                  <option value="author">Author (A-Z)</option>
                  <option value="year">Newest First</option>
                  <option value="pages">Most Pages</option>
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
      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
