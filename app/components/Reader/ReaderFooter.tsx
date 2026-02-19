"use client";
import React from "react";
import { motion } from "motion/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useReader } from "./ReaderContext";

interface ReaderFooterProps {
  currentPage: number;
  totalPages: number;
  showControls: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function ReaderFooter({
  currentPage,
  totalPages,
  showControls,
  onNextPage,
  onPrevPage,
}: ReaderFooterProps) {
  const { currentTheme } = useReader();
  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: showControls ? 0 : 100 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-0 w-full z-50 border-t ${currentTheme.ui} backdrop-blur-md bg-opacity-90`}
    >
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-black/5"
          } ${currentTheme.text}`}
        >
          <FiChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Previous</span>
        </button>

        <div className="flex flex-col items-center">
          <span className={`text-sm font-medium ${currentTheme.text}`}>
            Page {currentPage} of {totalPages}
          </span>
          <div className="w-32 sm:w-64 h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(currentPage / totalPages) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-black/5"
          } ${currentTheme.text}`}
        >
          <span className="hidden sm:inline font-medium">Next</span>
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.footer>
  );
}
