"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryFilter } from "@/app/components/Library/CategoryFilter";
import { BookCard } from "@/app/components/Library/BookCard";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiChevronRight } from "react-icons/fi";
import { BookPreview } from "@/app/types/book";
import { Folder } from "@/app/types/folder";

type RecommendedItem =
  | (BookPreview & { type: "book" })
  | (Folder & { type: "folder" });

export default function LibraryPage() {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);

  const recommendedItems: RecommendedItem[] = [
    {
      type: "book",
      id: "b1",
      donor_id: "morgan",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      pages: 234,
      description:
        "Explores the timeless lessons on wealth, greed, and happiness, emphasizing behavior over finance. ",
      category: "business",
      cover_image: "/dummycover.png",
      published_year: 2023,
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
      id: "b2",
      donor_id: "morgan",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      pages: 234,
      description:
        "Explores the timeless lessons on wealth, greed, and happiness, emphasizing behavior over finance. ",
      category: "business",
      cover_image: "/dummycover.png",
      published_year: 2023,
    },
    {
      type: "book",
      id: "b3",
      donor_id: "morgan",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      pages: 234,
      description:
        "Explores the timeless lessons on wealth, greed, and happiness, emphasizing behavior over finance. ",
      category: "business",
      cover_image: "/dummycover.png",
      published_year: 2023,
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
      id: "b4",
      donor_id: "morgan",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      pages: 234,
      description:
        "Explores the timeless lessons on wealth, greed, and happiness, emphasizing behavior over finance. ",
      category: "business",
      cover_image: "/dummycover.png",
      published_year: 2023,
    },
  ];

  const categoryBooks: BookPreview[] = [
    {
      id: "5",
      title: "The Bees",
      donor_id: "laline",
      author: "Laline Paull",
      cover_image: "/dummycover.png",
      pages: 384,
      category: "fiction",
      description:
        "A brilliantly imagined dystopian story set in a hive, examining power, survival, and individuality.",
      published_year: 2014,
    },
    {
      id: "6",
      title: "Vogue: September Issue 2024",
      donor_id: "vogue",
      author: "Vogue Magazine",
      cover_image: "/dummycover.png",
      pages: 250,
      category: "magazines",
      description:
        "The ultimate fashion guide for the season, featuring trends, style editorials, and celebrity interviews.",
      published_year: 2024,
    },
    {
      id: "7",
      title: "Batman: Year One (Full Run)",
      donor_id: "frankmiller",
      author: "Frank Miller & David Mazzucchelli",
      cover_image: "/dummycover.png",
      pages: 200,
      category: "comics",
      description:
        "An iconic comic series detailing Batman's early days, his struggle with crime in Gotham, and defining his legacy.",
      published_year: 1987,
    },
    {
      id: "8",
      title: "The Room",
      donor_id: "jonas",
      author: "Jonas Karlsson",
      cover_image: "/dummycover.png",
      pages: 220,
      category: "fiction",
      description:
        "A surreal novel exploring loneliness, imagination, and the boundaries of reality in modern life.",
      published_year: 2014,
    },
    {
      id: "9",
      title: "Norwegian Wood",
      donor_id: "murakami",
      author: "Haruki Murakami",
      cover_image: "/dummycover.png",
      pages: 368,
      category: "fiction",
      description:
        "A poignant coming-of-age story about love, loss, and personal transformation in 1960s Japan.",
      published_year: 1987,
    },
  ];

  return (
    <>
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-4 md:p-8">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Recommended
              </h2>
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
                  key={book.title}
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
