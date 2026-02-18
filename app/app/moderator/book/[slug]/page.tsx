"use client";
import React from "react";
import { motion } from "motion/react";
import {
  FiBook,
  FiUser,
  FiFileText,
  FiPlay,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/Form/Button";

export default function ModeratorBookDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const bookSlug = params.slug as string;
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "true";

  // Mock Data (matches the pending list style)
  const book = {
    id: bookSlug,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    description:
      "A comprehensive introduction to the modern study of computer algorithms. It covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.",
    pages: 1200,
    submitter: "John Doe",
    submittedDate: "2 days ago",
    status: verified ? "approved" : "pending",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-neutral-900">
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-800">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <button
              onClick={() => router.back()}
              className="mb-8 text-sm text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white flex items-center transition-colors"
            >
              ← Back to List
            </button>

            <div className="flex flex-col md:flex-row gap-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full md:w-1/3 lg:w-1/4 shrink-0"
              >
                <div className="relative aspect-2/3 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-neutral-700">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-neutral-800 animate-pulse" />
                  <div className="absolute inset-0 bg-linear-to-br from-blue-800 to-indigo-900 flex items-center justify-center text-white text-center p-6">
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
                <div className="flex items-center gap-3 mb-4">
                  {book.status === "approved" ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-bold flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4" /> Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-sm font-bold flex items-center gap-2">
                      <FiAlertCircle className="w-4 h-4" /> Pending Review
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-neutral-400 mb-6">
                  by {book.author}
                </p>

                <div className="flex items-center space-x-6 mb-8 text-sm text-gray-500 dark:text-neutral-400">
                  <div className="flex items-center">
                    <FiUser className="w-5 h-5 mr-2" />
                    <span>Submitted by {book.submitter}</span>
                  </div>
                  <div className="flex items-center">
                    <FiFileText className="w-5 h-5 mr-2" />
                    <span>{book.pages} Pages</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="w-48">
                    <Button
                      onClick={() =>
                        router.push(`/app/moderator/book/${bookSlug}/read`)
                      }
                      icon={<FiPlay className="w-5 h-5 fill-current" />}
                      variant={
                        book.status === "approved" ? "outline" : "primary"
                      }
                    >
                      {book.status === "approved"
                        ? "Read Content"
                        : "Start Review"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Description
            </h2>
            <p className="text-gray-600 dark:text-neutral-300 leading-relaxed text-lg">
              {book.description}
            </p>
          </section>

          <section className="mt-12 pt-12 border-t border-gray-200 dark:border-neutral-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Submission Guidelines check
            </h3>
            <ul className="space-y-3 text-gray-600 dark:text-neutral-400">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
                  <FiCheckCircle className="w-3 h-3" />
                </div>
                <span>File format is PDF/EPUB</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
                  <FiCheckCircle className="w-3 h-3" />
                </div>
                <span>Cover image is high quality</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-neutral-600 flex items-center justify-center"></div>
                <span>Content matches description (Pending verification)</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
