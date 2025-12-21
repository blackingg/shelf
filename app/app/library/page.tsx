"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryFilter } from "@/app/components/Library/CategoryFilter";
import { BookCard } from "@/app/components/Library/BookCard";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiChevronRight } from "react-icons/fi";
import { Book } from "@/app/types/book";
import { Folder } from "@/app/types/folder";

type RecommendedItem = (Book & { type: "book" }) | (Folder & { type: "folder" });

export default function LibraryPage() {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const recommendedItems: RecommendedItem[] = [
    {
      type: "book",
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
      donatedBy: "Morgan Housel",
      donatedAt: "2024-01-15T10:00:00Z",
      description: "Explores the timeless lessons on wealth, greed, and happiness, emphasizing behavior over finance. ",
      pages: 256,
      category: "business",
    },
    {
      type: "folder",
      id: "f1",
      slug: "summer-reading-list",
      name: "Summer Reading List",
      description: "My list for the summer",
      booksCount: 12,
      bookmarksCount: 45,
      visibility: "PUBLIC",
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdBy: "Sarah Chen",
      createdAt: new Date().toISOString(),
    },
    {
      type: "book",
      id: "2",
      slug: "how-innovation-works",
      title: "How Innovation Works",
      author: "Matt Ridley",
      coverImage: "/dummycover.png",
      rating: 4.6,
      ratingsCount: 320,
      reviewsCount: 95,
      readersCount: 842,
      downloadsCount: 400,
      donatedBy: "Morgan Housel",
      donatedAt: "2024-01-15T10:00:00Z",
      description: "A fascinating dive into how human creativity and incremental change drive real-world innovation.",
      pages: 368,
      category: "science",
    },
    {
      type: "book",
      id: "3",
      slug: "company-of-one",
      title: "Company of One",
      author: "Paul Jarvis",
      coverImage: "/dummycover.png",
      rating: 4.5,
      ratingsCount: 280,
      reviewsCount: 110,
      readersCount: 643,
      downloadsCount: 300,
      donatedBy: "Paul Jarvis",
      donatedAt: "2024-01-15T10:00:00Z",
      description: "Offers a refreshingly original business strategy focused on staying small but thriving with purpose.",
      pages: 192,
      category: "business",
    },
    {
      type: "folder",
      id: "f2",
      slug: "design-inspiration",
      name: "Design Inspiration",
      description: "Cool design books",
      booksCount: 8,
      bookmarksCount: 32,
      visibility: "PUBLIC",
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdBy: "Alex Morgan",
      createdAt: new Date().toISOString(),
    },
    {
      type: "book",
      id: "4",
      slug: "great-gatsby",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverImage: "/dummycover.png",
      rating: 4.4,
      ratingsCount: 950,
      reviewsCount: 345,
      readersCount: 2310,
      downloadsCount: 1100,
      donatedBy: "Fitzgerald Estate",
      donatedAt: "2024-01-15T10:00:00Z",
      description: "The quintessential Jazz Age novel that explores themes of love, ambition, and the American dream.",
      pages: 180,
      category: "classics",
    },
  ];

  const categoryBooks: Book[] = [
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
      description: "A brilliantly imagined dystopian story set in a hive, examining power, survival, and individuality.",
      pages: 384,
      category: "fiction",
    },
    {
      id: "6",
      slug: "vogue-september",
      title: "Vogue: September Issue 2024",
      author: "Vogue Magazine",
      coverImage: "/dummycover.png",
      rating: 4.7,
      ratingsCount: 120,
      reviewsCount: 60,
      readersCount: 1050,
      downloadsCount: 500,
      donatedBy: "Vogue",
      donatedAt: "2024-01-15T10:00:00Z",
      description: "The ultimate fashion guide for the season, featuring trends, style editorials, and celebrity interviews.",
      pages: 250,
      category: "magazines",
    },
    {
      id: "7",
      slug: "batman-year-one",
      title: "Batman: Year One (Full Run)",
      author: "Frank Miller & David Mazzucchelli",
      coverImage: "/dummycover.png",
      rating: 4.9,
      ratingsCount: 850,
      reviewsCount: 85,
      readersCount: 950,
      downloadsCount: 600,
      donatedBy: "Frank Miller",
      donatedAt: "2024-01-15T10:00:00Z",
      description: "An iconic comic series detailing Batman's early days, his struggle with crime in Gotham, and defining his legacy.",
      pages: 200,
      category: "comics",
    },
    {
      id: "8",
      slug: "the-room",
      title: "The Room",
      author: "Jonas Karlsson",
      coverImage: "/dummycover.png",
      rating: 4.5,
      ratingsCount: 120,
      reviewsCount: 48,
      readersCount: 430,
      downloadsCount: 200,
      donatedBy: "Jonas Karlsson",
      donatedAt: "2024-01-15T10:00:00Z",
      description: "A surreal novel exploring loneliness, imagination, and the boundaries of reality in modern life.",
      pages: 220,
      category: "fiction",
    },
    {
      id: "9",
      slug: "norwegian-wood",
      title: "Norwegian Wood",
      author: "Haruki Murakami",
      coverImage: "/dummycover.png",
      rating: 4.6,
      ratingsCount: 540,
      reviewsCount: 175,
      readersCount: 1120,
      downloadsCount: 800,
      donatedBy: "Haruki Murakami",
      donatedAt: "2024-01-15T10:00:00Z",
      description: "A poignant coming-of-age story about love, loss, and personal transformation in 1960s Japan.",
      pages: 368,
      category: "fiction",
    },
  ];

  return (
    <>
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-4 md:p-8">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Recommended</h2>
              <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                <span>See All</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {recommendedItems.map((item) => {
                if (item.type === "folder") {
                  return (
                    <FolderCard
                      key={item.id}
                      folder={item}
                      onClick={() => router.push(`/app/folders/${item.id}`)}
                    />
                  );
                } else {
                  return (
                    <BookCard
                      key={item.id}
                      {...item}
                      onClick={() => setSelectedBook(item)}
                    />
                  );
                }
              })}
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Categories
            </h2>
            <CategoryFilter />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
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
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
