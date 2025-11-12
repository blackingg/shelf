"use client";
import { useState } from "react";
import { SearchBar } from "@/app/components/Library/SearchBar";
import { CategoryFilter } from "@/app/components/Library/CategoryFilter";
import { BookCard } from "@/app/components/Library/BookCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiChevronRight, FiBell, FiChevronDown } from "react-icons/fi";
import Image from "next/image";

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const categories = [
    "All",
    "Sci-Fi",
    "Fantasy",
    "Drama",
    "Business",
    "Education",
    "Geography",
  ];

  const recommendedBooks = [
    {
      id: 1,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      coverImage: "/books/psychology.jpg",
      rating: 4.8,
    },
    {
      id: 2,
      title: "How Innovation Works",
      author: "Matt Ridley",
      coverImage: "/books/innovation.jpg",
      rating: 4.6,
    },
    {
      id: 3,
      title: "Company of One",
      author: "Paul Jarvis",
      coverImage: "/books/company.jpg",
      rating: 4.5,
    },
    {
      id: 4,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverImage: "/books/gatsby.jpg",
      rating: 4.4,
    },
  ];

  const categoryBooks = [
    {
      id: 5,
      title: "The Bees",
      author: "Laline Paull",
      coverImage: "/books/bees.jpg",
      rating: 4.8,
    },
    {
      id: 6,
      title: "Vogue: September Issue 2024",
      author: "Vogue Magazine",
      coverImage: "/books/vogue.jpg",
      rating: 4.7,
    },
    {
      id: 7,
      title: "Batman: Year One (Full Run)",
      author: "Frank Miller & David Mazzucchelli",
      coverImage: "/books/batman.jpg",
      rating: 4.9,
    },
    {
      id: 8,
      title: "The Room",
      author: "Jonas Karlsson",
      coverImage: "/books/room.jpg",
      rating: 4.5,
    },
    {
      id: 9,
      title: "Norwegian Wood",
      author: "Haruki Murakami",
      coverImage: "/books/wood.jpg",
      rating: 4.6,
    },
  ];

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <div className="flex items-center space-x-4 ml-6">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiBell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center space-x-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden relative">
                  <Image
                    src="/avatar.jpg"
                    alt="User"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium text-gray-900">Balogun</span>
                <FiChevronDown className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recommended</h2>
              <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                <span>See All</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {recommendedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  {...book}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Categories
            </h2>
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <div className="grid grid-cols-5 gap-6 mt-6">
              {categoryBooks.map((book) => (
                <BookCard
                  key={book.id}
                  {...book}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {selectedBook && (
        <BookDetailPanel
          book={{
            ...selectedBook,
            totalRatings: 48,
            pages: 320,
            readingCount: 643,
            reviews: 110,
            description:
              "Company of One offers a refreshingly original business strategy that's focused on commitment to being better instead of bigger. Why? Because staying small provides one with the freedom to pursue more meaningful pleasures in life—and avoid the headaches that...",
          }}
          onClose={() => setSelectedBook(null)}
          onReadNow={() => console.log("Read now clicked")}
        />
      )}
    </>
  );
}
