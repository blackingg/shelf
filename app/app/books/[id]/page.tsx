"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FiBook,
  FiStar,
  FiFileText,
  FiFolderPlus,
  FiPlay,
} from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/app/components/Form/Button";
import { FolderDropdown } from "@/app/components/Library/FolderDropdown";
import {
  useAddBookToFolderMutation,
  useRemoveBookFromFolderMutation,
} from "@/app/store/api/foldersApi";
import { useNotifications } from "@/app/context/NotificationContext";

export default function BookDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { addNotification } = useNotifications();
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [savedFolders, setSavedFolders] = useState<string[]>([]);

  const [addBookToFolder] = useAddBookToFolderMutation();
  const [removeBookFromFolder] = useRemoveBookFromFolderMutation();

  // Mock Data
  const book = {
    id: params.id as string,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverImage: "/dummycover.png",
    rating: 4.8,
    pages: 256,
    description:
      "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. Money—investing, personal finance, and business decisions—is typically taught as a math-based field, where data and formulas tell us exactly what to do. But in the real world people don't make financial decisions on a spreadsheet. They make them at the dinner table, or in a meeting room, where personal history, your own unique view of the world, ego, pride, marketing, and odd incentives are scrambled together. In The Psychology of Money, award-winning author Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life's most important topics.",
    genres: ["Finance", "Psychology", "Self-help", "Business"],
    donorDate: "September 8, 2025",
    donor: "Harriman House",
  };

  const handleSaveToFolder = async (folderId: string) => {
    try {
      if (savedFolders.includes(folderId)) {
        await removeBookFromFolder({ id: folderId, bookId: book.id }).unwrap();
        setSavedFolders(savedFolders.filter((id) => id !== folderId));
        addNotification("success", "Book removed from folder");
      } else {
        await addBookToFolder({
          id: folderId,
          data: { bookId: book.id },
        }).unwrap();
        setSavedFolders([...savedFolders, folderId]);
        addNotification("success", "Book added to folder");
      }
    } catch (error) {
      addNotification("error", "Failed to update folder");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col ">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row gap-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full md:w-1/3 lg:w-1/4 shrink-0"
              >
                <div className="relative aspect-2/3 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-teal-900 flex items-center justify-center text-white text-center p-6">
                    <div>
                      <FiBook className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <span className="font-serif text-xl font-bold">
                        {book.title}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-gray-600 mb-6">by {book.author}</p>

                <div className="flex items-center space-x-6 mb-8 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiStar className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-bold text-gray-900 mr-1">
                      {book.rating}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiFileText className="w-5 h-5 mr-2" />
                    <span>{book.pages} Pages</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="w-40">
                    <Button
                      onClick={() =>
                        router.push(`/app/books/${params.id}/read`)
                      }
                      icon={<FiPlay className="w-5 h-5 fill-current" />}
                    >
                      Read Now
                    </Button>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                      className={`px-6 py-3 border-2 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                        showFolderDropdown
                          ? "border-emerald-500 text-emerald-700 bg-emerald-50"
                          : "border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      <FiFolderPlus className="w-5 h-5" />
                      <span>Add to Folder</span>
                    </button>

                    <FolderDropdown
                      isOpen={showFolderDropdown}
                      onClose={() => setShowFolderDropdown(false)}
                      currentBookFolders={savedFolders}
                      onSaveToFolder={handleSaveToFolder}
                      className="top-full mt-2 w-72"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {book.description}
                </p>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">
                  Book Information
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Donor</span>
                    <span className="font-medium text-gray-900 hover:underline">
                      {book.donor}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Donated</span>
                    <span className="font-medium text-gray-900">
                      {book.donorDate}
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-bold text-gray-900 mb-4">Similar Books</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 group cursor-pointer"
                    >
                      <div className="w-16 h-24 bg-gray-200 rounded-lg shrink-0" />
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          Atomic Habits
                        </div>
                        <div className="text-sm text-gray-500">James Clear</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
