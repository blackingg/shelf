"use client";
import { useState } from "react";
import { PageHeader } from "@/app/components/PageHeader";
import { CategoryFilter } from "@/app/components/Library/CategoryFilter";
import { BookCard } from "@/app/components/Library/BookCard";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiChevronRight } from "react-icons/fi";

type BookItem = {
  type: "book";
  id: number;
  title: string;
  author: string;
  coverImage: string;
  rating?: number;
  pages?: number;
  readingCount?: number;
  reviews?: number;
  description?: string;
};

type FolderItem = {
  type: "folder";
  id: string;
  name: string;
  bookCount: number;
  isPublic: boolean;
  coverImages?: string[];
  createdBy?: string;
};

type RecommendedItem = BookItem | FolderItem;

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const recommendedItems: RecommendedItem[] = [
    {
      type: "book",
      id: 1,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      coverImage: "/books/psychology.jpg",
      rating: 4.8,
      pages: 256,
      readingCount: 1203,
      reviews: 210,
      description:
        "Explores the timeless lessons on wealth, greed, and happiness, emphasizing behavior over finance. ",
    },
    {
      type: "folder",
      id: "f1",
      name: "Summer Reading List",
      bookCount: 12,
      isPublic: true,
      coverImages: ["/books/gatsby.jpg", "/books/wood.jpg"],
      createdBy: "Sarah Chen",
    },
    {
      type: "book",
      id: 2,
      title: "How Innovation Works",
      author: "Matt Ridley",
      coverImage: "/books/innovation.jpg",
      rating: 4.6,
      pages: 368,
      readingCount: 842,
      reviews: 95,
      description:
        "A fascinating dive into how human creativity and incremental change drive real-world innovation.",
    },
    {
      type: "book",
      id: 3,
      title: "Company of One",
      author: "Paul Jarvis",
      coverImage: "/books/company.jpg",
      rating: 4.5,
      pages: 192,
      readingCount: 643,
      reviews: 110,
      description:
        "Offers a refreshingly original business strategy focused on staying small but thriving with purpose.",
    },
    {
      type: "folder",
      id: "f2",
      name: "Design Inspiration",
      bookCount: 8,
      isPublic: true,
      coverImages: ["/books/vogue.jpg", "/books/innovation.jpg"],
      createdBy: "Alex Morgan",
    },
    {
      type: "book",
      id: 4,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverImage: "/books/gatsby.jpg",
      rating: 4.4,
      pages: 180,
      readingCount: 2310,
      reviews: 345,
      description:
        "The quintessential Jazz Age novel that explores themes of love, ambition, and the American dream.",
    },
  ];

  const categoryBooks = [
    {
      id: 5,
      title: "The Bees",
      author: "Laline Paull",
      coverImage: "/books/bees.jpg",
      rating: 4.8,
      pages: 384,
      readingCount: 720,
      reviews: 140,
      description:
        "A brilliantly imagined dystopian story set in a hive, examining power, survival, and individuality.",
    },
    {
      id: 6,
      title: "Vogue: September Issue 2024",
      author: "Vogue Magazine",
      coverImage: "/books/vogue.jpg",
      rating: 4.7,
      pages: 250,
      readingCount: 1050,
      reviews: 60,
      description:
        "The ultimate fashion guide for the season, featuring trends, style editorials, and celebrity interviews.",
    },
    {
      id: 7,
      title: "Batman: Year One (Full Run)",
      author: "Frank Miller & David Mazzucchelli",
      coverImage: "/books/batman.jpg",
      rating: 4.9,
      pages: 200,
      readingCount: 950,
      reviews: 85,
      description:
        "An iconic comic series detailing Batman's early days, his struggle with crime in Gotham, and defining his legacy.",
    },
    {
      id: 8,
      title: "The Room",
      author: "Jonas Karlsson",
      coverImage: "/books/room.jpg",
      rating: 4.5,
      pages: 220,
      readingCount: 430,
      reviews: 48,
      description:
        "A surreal novel exploring loneliness, imagination, and the boundaries of reality in modern life.",
    },
    {
      id: 9,
      title: "Norwegian Wood",
      author: "Haruki Murakami",
      coverImage: "/books/wood.jpg",
      rating: 4.6,
      pages: 368,
      readingCount: 1120,
      reviews: 175,
      description:
        "A poignant coming-of-age story about love, loss, and personal transformation in 1960s Japan.",
    },
  ];

  return (
    <>
      <main className="flex-1 overflow-y-auto ">
        <PageHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="p-8">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recommended</h2>
              <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                <span>See All</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommendedItems.map((item) => {
                if (item.type === "folder") {
                  return (
                    <FolderCard
                      key={item.id}
                      folder={{
                        id: item.id,
                        name: item.name,
                        bookCount: item.bookCount,
                        isPublic: item.isPublic,
                        coverImages: item.coverImages,
                        createdBy: item.createdBy,
                      }}
                      onClick={() => console.log("Folder clicked:", item.name)}
                    />
                  );
                } else {
                  return (
                    <BookCard
                      key={item.id}
                      title={item.title}
                      author={item.author}
                      coverImage={item.coverImage}
                      rating={item.rating}
                      onClick={() => setSelectedBook(item)}
                    />
                  );
                }
              })}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Categories
            </h2>
            <CategoryFilter />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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

      <BookDetailPanel
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
