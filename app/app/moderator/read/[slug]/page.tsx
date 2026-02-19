"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiCheckCircle, FiXCircle, FiMessageSquare } from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import { useNotifications } from "@/app/context/NotificationContext";
import { ReaderLayout } from "@/app/components/Reader/ReaderLayout";
import {
  readerThemes,
  ReaderThemeName,
} from "@/app/components/Reader/readerThemes";

export default function ModeratorReaderPage() {
  const router = useRouter();
  const params = useParams();
  const bookSlug = params.slug as string;
  const { addNotification } = useNotifications();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(42);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [reviewNote, setReviewNote] = useState("");

  const title = "Introduction to Algorithms";
  const chapterTitle = "Chapter 1: The Role of Algorithms";

  const handleApprove = () => {
    addNotification("success", "Document Verified Successfully");
    setTimeout(() => {
      router.push(`/app/moderator/book/${bookSlug}?verified=true`);
    }, 1000);
  };

  const handleReject = () => {
    addNotification("error", "Document Rejected");
    setTimeout(() => {
      router.push(`/app/moderator/book/${bookSlug}`);
    }, 1000);
  };

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [theme] = useState<ReaderThemeName>("light");
  const currentTheme = readerThemes[theme];

  const reviewPanelToggle = (
    <button
      onClick={() => setShowReviewPanel(!showReviewPanel)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all font-medium ${
        showReviewPanel
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
          : "border border-gray-200 hover:bg-black/5"
      }`}
    >
      <FiMessageSquare className="w-5 h-5" />
      <span className="hidden sm:inline">Review Panel</span>
    </button>
  );

  const reviewPanel = (
    <AnimatePresence>
      {showReviewPanel && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className={`fixed right-0 top-16 bottom-0 w-80 shadow-2xl z-40 overflow-y-auto border-l ${currentTheme.panel} ${currentTheme.text}`}
        >
          <div className="p-6 h-full flex flex-col">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FiMessageSquare /> Moderator Review
            </h3>

            <div className="flex-1 space-y-4">
              <div
                className={`p-4 rounded-xl border ${currentTheme.bg === "bg-white" ? "bg-white" : "bg-black/10"}`}
              >
                <label className="text-xs font-bold uppercase block mb-2 opacity-70">
                  Content Quality
                </label>
                <p className="text-sm opacity-80">
                  Does the content match the description and quality standards?
                </p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-2 opacity-70">
                  Notes for Uploader (Optional)
                </label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Add reason for rejection or approval note..."
                  className={`w-full p-3 rounded-xl border bg-transparent resize-none focus:ring-2 focus:ring-emerald-500 outline-none h-32 text-sm ${currentTheme.ui}`}
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleApprove}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <FiCheckCircle className="w-5 h-5" /> Verify & Approve
              </button>
              <button
                onClick={handleReject}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:text-red-400 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <FiXCircle className="w-5 h-5" /> Reject
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <ReaderLayout
      title={title}
      titlePrefix="Reviewing:"
      currentPage={currentPage}
      totalPages={totalPages}
      onNextPage={nextPage}
      onPrevPage={prevPage}
      onPageChange={handlePageChange}
      extraHeaderActions={reviewPanelToggle}
      extraPanels={reviewPanel}
      contentShrink={showReviewPanel}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="font-serif"
        style={{ lineHeight: "1.8" }}
      >
        <div className="text-center mb-12">
          <span className="text-sm font-sans uppercase tracking-widest opacity-60">
            {chapterTitle}
          </span>
          <h2 className="text-4xl font-bold mt-4 mb-8">
            The Role of Algorithms in Computing
          </h2>
        </div>

        <p className="mb-6">
          What are algorithms? Why is the study of algorithms worthwhile? What
          is the role of algorithms relative to other technologies used in
          computers? In this chapter, we will answer these questions.
        </p>
        <p className="mb-6">
          Informally, an algorithm is any well-defined computational procedure
          that takes some value, or set of values, as input and produces some
          value, or set of values, as output. An algorithm is thus a sequence of
          computational steps that transform the input into the output.
        </p>
        <p className="mb-6">
          We can also view an algorithm as a tool for solving a well-specified
          computational problem. The statement of the problem specifies in
          general terms the desired input/output relationship. The algorithm
          describes a specific computational procedure for achieving that
          input/output relationship.
        </p>
        <p className="mb-6">
          For example, we might need to sort a sequence of numbers into
          nondecreasing order. This problem arises frequently in practice and
          provides fertile ground for introducing many standard design
          techniques and analysis tools. Here is how we formally define the
          sorting problem:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>
            <strong>Input:</strong> A sequence of n numbers (a1, a2, ..., an).
          </li>
          <li>
            <strong>Output:</strong> A permutation (reordering) (a&apos;1,
            a&apos;2, ..., a&apos;n) of the input sequence such that a&apos;1 ≤
            a&apos;2 ≤ ... ≤ a&apos;n.
          </li>
        </ul>
        <p className="mb-6">
          For example, given the input sequence (31, 41, 59, 26, 41, 58), a
          sorting algorithm returns as output the sequence (26, 31, 41, 41, 58,
          59). Such an input sequence is called an instance of the sorting
          problem. In general, an instance of a problem consists of the input
          (satisfying whatever constraints are imposed in the problem statement)
          needed to compute a solution to the problem.
        </p>
        <p className="mb-6">
          An algorithm is said to be correct if, for every input instance, it
          halts with the correct output. We say that a correct algorithm solves
          the given computational problem. An incorrect algorithm might not halt
          at all on some input instances, or it might halt with an incorrect
          answer. Contrary to what one might expect, incorrect algorithms can
          sometimes be useful, if their error rate can be controlled.
        </p>
      </motion.div>
    </ReaderLayout>
  );
}
