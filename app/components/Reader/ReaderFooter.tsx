"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiChevronLeft, FiChevronRight, FiGrid } from "react-icons/fi";
import { useReader } from "./ReaderContext";

interface ReaderFooterProps {
  currentPage: number;
  totalPages: number;
  showControls: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageChange?: (page: number) => void;
}

export function ReaderFooter({
  currentPage,
  totalPages,
  showControls,
  onNextPage,
  onPrevPage,
  onPageChange,
}: ReaderFooterProps) {
  const { currentTheme } = useReader();
  const [showPageJump, setShowPageJump] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(currentPage.toString());
  const pageJumpRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pageJumpRef.current &&
        !pageJumpRef.current.contains(event.target as Node)
      ) {
        setShowPageJump(false);
      }
    };
    if (showPageJump) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPageJump]);

  const handleJump = () => {
    const val = parseInt(inputValue);
    if (val >= 1 && val <= totalPages) {
      onPageChange?.(val);
      setShowPageJump(false);
    } else {
      setInputValue(currentPage.toString());
    }
  };

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

        <div
          className="flex flex-col items-center relative"
          ref={pageJumpRef}
        >
          <div className="flex items-center gap-2 group">
            <span
              className={`text-sm font-semibold opacity-50 ${currentTheme.text}`}
            >
              Page
            </span>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setShowPageJump(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleJump();
                  }
                }}
                className={`w-12 text-center py-1 rounded-lg border-2 border-transparent focus:border-emerald-500 bg-black/5 outline-none transition-all font-bold ${currentTheme.text}`}
              />
              <FiGrid className="absolute -right-6 top-1/2 -translate-y-1/2 w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <span
              className={`text-sm font-semibold opacity-50 ${currentTheme.text}`}
            >
              of {totalPages}
            </span>
          </div>

          <div className="w-32 sm:w-64 h-1 bg-gray-200 dark:bg-neutral-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(currentPage / totalPages) * 100}%` }}
            />
          </div>

          <AnimatePresence>
            {showPageJump && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`absolute bottom-full mb-6 w-56 max-h-72 flex flex-col rounded-2xl shadow-2xl border ${currentTheme.ui} z-[60] overflow-hidden`}
              >
                <div className="p-3 border-b border-gray-100 dark:border-neutral-800">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${currentTheme.text} opacity-50`}
                  >
                    Select Page
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => {
                          onPageChange?.(p);
                          setShowPageJump(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all flex justify-between items-center ${
                          currentPage === p
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                            : `hover:bg-black/5 ${currentTheme.text}`
                        }`}
                      >
                        <span>Page {p}</span>
                        {currentPage === p && (
                          <span className="text-[10px] font-bold">Current</span>
                        )}
                      </button>
                    ),
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
