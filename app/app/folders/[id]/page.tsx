"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BooksTable from "@/app/components/Folders/BooksTable";
import {
  FiFolder,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiShare2,
  FiArrowLeft,
} from "react-icons/fi";

import { Book } from "@/app/types/book";

export default function FolderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  // Mock Data
  const folder = {
    id: params.id,
    name: "Summer Reading List",
    description:
      "A collection of books I want to read this summer, focusing on self-improvement and fiction.",
    bookCount: 12,
    isPublic: true,
    createdBy: "Sarah Chen",
    createdAt: "Sep 2024",
    books: [
      {
        type: "book",
        id: 1,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        coverImage: "/dummycover.png",
        rating: 4.8,
        donatedBy: "Morgan Housel",
        pages: 256,
        readingCount: 1203,
        reviews: 210,
        description:
          "Explores the timeless lessons on wealth, greed, and happiness...",
      },
      {
        type: "book",
        id: 2,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        coverImage: "/dummycover.png",
        rating: 4.4,
        donatedBy: "Fitzgerald Estate",
        pages: 180,
        readingCount: 2310,
        reviews: 345,
        description: "The quintessential Jazz Age novel...",
      },
      {
        type: "book",
        id: 3,
        title: "Company of One",
        author: "Paul Jarvis",
        coverImage: "/dummycover.png",
        rating: 4.5,
        donatedBy: "Paul Jarvis",
        pages: 192,
        readingCount: 643,
        reviews: 110,
        description:
          "Offers a refreshingly original business strategy focused on staying small but thriving with purpose.",
      },
      {
        type: "book",
        id: 5,
        title: "The Bees",
        author: "Laline Paull",
        coverImage: "/dummycover.png",
        rating: 4.8,
        donatedBy: "Laline Paull",
        pages: 384,
        readingCount: 720,
        reviews: 140,
        description:
          "A brilliantly imagined dystopian story set in a hive, examining power, survival, and individuality.",
      },
    ] as Book[],
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <FiFolder className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {folder.name}
                </h1>
                <p className="text-gray-600 max-w-2xl mb-4">
                  {folder.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{folder.bookCount} books</span>
                  <span>•</span>
                  <span>Created by {folder.createdBy}</span>
                  <span>•</span>
                  <span>{folder.isPublic ? "Public" : "Private"}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiMoreVertical className="w-5 h-5 text-gray-500" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10">
                  <button
                    onClick={() => router.push(`/app/folders/${folder.id}/edit`)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit Folder</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <FiShare2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                    <FiTrash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <BooksTable
              books={folder.books}
              onBookClick={(bookId) => router.push(`/app/books/${bookId}/read`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
