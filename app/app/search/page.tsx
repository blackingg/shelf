"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { BookCard } from "@/app/components/Library/BookCard";
import { useRouter } from "next/navigation";
import { Book } from "@/app/types/book";
import { Folder } from "@/app/types/folder";

type SearchResult = Book | Folder;

// Mock Data
const allFolders: Folder[] = [
  {
    type: "folder",
    id: "1",
    name: "Want to Read",
    bookCount: 12,
    isPublic: false,
    coverImages: ["/dummycover.png", "/dummycover.png"],
    createdBy: "You",
  },
  {
    type: "folder",
    id: "2",
    name: "Favorites",
    bookCount: 8,
    isPublic: false,
    coverImages: ["/dummycover.png", "/dummycover.png"],
    createdBy: "You",
  },
  {
    type: "folder",
    id: "3",
    name: "Study Materials",
    bookCount: 15,
    isPublic: true,
    coverImages: ["/dummycover.png", "/dummycover.png"],
    createdBy: "You",
  },
  {
    type: "folder",
    id: "4",
    name: "Best Fiction 2024",
    bookCount: 24,
    isPublic: true,
    createdBy: "Sarah Johnson",
    coverImages: ["/dummycover.png", "/dummycover.png"],
  },
  {
    type: "folder",
    id: "5",
    name: "Tech & Innovation",
    bookCount: 18,
    isPublic: true,
    createdBy: "Mike Chen",
    coverImages: ["/dummycover.png", "/dummycover.png"],
  },
];

const allBooks: Book[] = [
  {
    type: "book",
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverImage: "/dummycover.png",
    rating: 4.8,
    donatedBy: "Sheriff Olopade",
    description: "Explores the timeless lessons on wealth, greed, and happiness, emphasizing behavior over finance. ",
  },
  {
    type: "book",
    id: 2,
    title: "How Innovation Works",
    author: "Matt Ridley",
    coverImage: "/dummycover.png",
    rating: 4.6,
    donatedBy: "Arogundade Sodiq",
    description: "A fascinating dive into how human creativity and incremental change drive real-world innovation.",
  },
  {
    type: "book",
    id: 3,
    title: "Company of One",
    author: "Paul Jarvis",
    coverImage: "/dummycover.png",
    rating: 4.5,
    donatedBy: "Paul Jarvis",
    description: "Offers a refreshingly original business strategy focused on staying small but thriving with purpose.",
  },
  {
    type: "book",
    id: 4,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverImage: "/dummycover.png",
    rating: 4.4,
    donatedBy: "F. Scott Fitzgerald Estate",
    description: "The quintessential Jazz Age novel that explores themes of love, ambition, and the American dream.",
  },
  {
    type: "book",
    id: 5,
    title: "The Bees",
    author: "Laline Paull",
    coverImage: "/dummycover.png",
    rating: 4.8,
    donatedBy: "Laline Paull",
    description: "A brilliantly imagined dystopian story set in a hive, examining power, survival, and individuality.",
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();

  const filteredBooks = allBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
  );
  const filteredFolders = allFolders.filter((folder) =>
    folder.name.toLowerCase().includes(query.toLowerCase())
  );

  const results: SearchResult[] = [...filteredFolders, ...filteredBooks];

  if (!query) {
    return (
      <div className="p-8 text-center text-gray-500">
        Please enter a search term to find books and folders.
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No results found for "{query}".
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Search Results for "{query}"
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {results.map((item) => {
          if (item.type === "folder") {
            return (
              <FolderCard
                key={`folder-${item.id}`}
                folder={item}
                onClick={() => router.push(`/app/folders/${item.id}`)}
              />
            );
          } else {
            return (
              <BookCard
                key={`book-${item.id}`}
                title={item.title}
                author={item.author}
                coverImage={item.coverImage}
                rating={item.rating}
                donatedBy={item.donatedBy}
                onClick={() => router.push(`/app/books/${item.id}`)}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
