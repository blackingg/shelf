"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Folder } from "@/app/types/folder";
import { FiFolder, FiUploadCloud, FiCalendar, FiShield } from "react-icons/fi";
import { BookCard } from "@/app/components/Library/BookCard";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";

const MOCK_USER = {
  name: "Sarah Chen",
  bio: "Book lover, coffee enthusiast, and aspiring writer. Always looking for the next great story.",
  mod: true,
  joinDate: "September 2024",
  stats: {
    booksRead: 142,
    booksDonated: 23,
    publicFolders: 8,
  },
};

const MOCK_BOOKS: BookPreview[] = [
  {
    id: "1",
    title: "The Psychology of Money",
    donor_id: "sarahchen",
    author: "Morgan Housel",
    cover_image: "/dummycover.png",
    description:
      "Explores the timeless lessons on wealth, greed, and happiness, emphasizing behavior over finance.",
    pages: 256,
    category: "business",
    published_year: 2020,
  },
  {
    id: "2",
    title: "How Innovation Works",
    donor_id: "sarahchen",
    author: "Matt Ridley",
    cover_image: "/dummycover.png",
    description:
      "A fascinating dive into how human creativity and incremental change drive real-world innovation.",
    pages: 368,
    category: "science",
    published_year: 2019,
  },
  {
    id: "3",
    title: "Company of One",
    donor_id: "sarahchen",
    author: "Paul Jarvis",
    cover_image: "/dummycover.png",
    description:
      "Offers a refreshingly original business strategy focused on staying small but thriving with purpose.",
    pages: 192,
    category: "business",
    published_year: 2019,
  },
  {
    id: "4",
    title: "The Great Gatsby",
    donor_id: "sarahchen",
    author: "F. Scott Fitzgerald",
    cover_image: "/dummycover.png",
    description:
      "The quintessential Jazz Age novel that explores themes of love, ambition, and the American dream.",
    pages: 180,
    category: "classics",
    published_year: 1925,
  },
  {
    id: "5",
    title: "The Bees",
    donor_id: "sarahchen",
    author: "Laline Paull",
    cover_image: "/dummycover.png",
    description:
      "A brilliantly imagined dystopian story set in a hive, examining power, survival, and individuality.",
    pages: 384,
    category: "fiction",
    published_year: 2014,
  },
];

const MOCK_FOLDERS: Folder[] = [
  {
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
    id: "f2",
    slug: "design-inspiration",
    name: "Design Inspiration",
    description: "Cool design books",
    booksCount: 8,
    bookmarksCount: 32,
    visibility: "PUBLIC",
    coverImages: ["/dummycover.png", "/dummycover.png"],
    createdBy: "Sarah Chen",
    createdAt: new Date().toISOString(),
  },
  {
    id: "f3",
    slug: "tech-society",
    name: "Tech & Society",
    description: "Intersection of tech and people",
    booksCount: 5,
    bookmarksCount: 12,
    visibility: "PUBLIC",
    coverImages: ["/dummycover.png", "/dummycover.png"],
    createdBy: "Sarah Chen",
    createdAt: new Date().toISOString(),
  },
];

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState<"donated" | "folders">("donated");
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);

  const tabs = [
    {
      id: "donated",
      label: "Donated",
      icon: FiUploadCloud,
      count: MOCK_USER.stats.booksDonated,
    },
    {
      id: "folders",
      label: "Folders",
      icon: FiFolder,
      count: MOCK_USER.stats.publicFolders,
    },
  ];

  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="relative h-48 bg-gradient-to-br from-emerald-950 via-emerald-900 to-gray-900">
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-8">
          <div className="relative -mt-16 mb-6 flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-xl">
              <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center text-4xl font-bold text-emerald-700">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 pb-2">
              <div className="flex gap-3 items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {MOCK_USER.name}
                </h1>
                {MOCK_USER.mod && (
                  <div className="flex items-center gap-2 p-1.5 rounded-md bg-emerald-700 border border-emerald-200 w-fit">
                    <FiShield className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
              </div>
              <p className="text-gray-500 font-medium">@{username}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FiCalendar className="w-4 h-4" />
              Joined {MOCK_USER.joinDate}
            </div>
            <div className="flex gap-8 items-center justify-start md:justify-end">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {MOCK_USER.stats.booksDonated}
                </div>
                <div className="text-sm text-gray-500">Books Donated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {MOCK_USER.stats.publicFolders}
                </div>
                <div className="text-sm text-gray-500">Public Folders</div>
              </div>
            </div>
          </div>

          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "donated" | "folders")}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    isActive
                      ? "border-emerald-600 text-emerald-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "donated" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {MOCK_BOOKS.slice(0, 3).map((book) => (
                <BookCard
                  key={book.id}
                  {...book}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>
          )}

          {activeTab === "folders" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {MOCK_FOLDERS.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onClick={() => router.push(`/app/folders/${folder.id}`)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
