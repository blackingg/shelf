"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
  const { currentTheme, themeName } = useReader();
  const [showPageJump, setShowPageJump] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(currentPage.toString());
  const pageJumpRef = React.useRef<HTMLDivElement>(null);

  const hoverBgClass =
    themeName === "sepia"
      ? "hover:bg-[#dccfb4]/35"
      : themeName === "dark"
        ? "hover:bg-white/5"
        : "hover:bg-black/5";

  const inputBgClass =
    themeName === "sepia"
      ? "bg-[#dccfb4]/60"
      : themeName === "dark"
        ? "bg-white/5"
        : "bg-black/5";

  const progressTrackBgClass =
    themeName === "sepia"
      ? "bg-[#dccfb4]"
      : themeName === "dark"
        ? "bg-neutral-800"
        : "bg-gray-200";

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
      className={`fixed bottom-0 w-full z-50 border-t ${currentTheme.ui} backdrop-blur-md bg-opacity-95`}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-sm transition-colors ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : hoverBgClass
          } ${currentTheme.text}`}
        >
          <FiChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-medium uppercase tracking-widest mt-0.5">
            Previous
          </span>
        </button>

        <div
          className="flex flex-col items-center relative"
          ref={pageJumpRef}
        >
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] font-medium uppercase tracking-widest opacity-40 ${currentTheme.text}`}
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
                className={`w-12 text-center py-1 rounded-sm border border-transparent focus:border-primary ${inputBgClass} outline-none transition-all text-xs font-medium ${currentTheme.text}`}
              />
            </div>
            <span
              className={`text-[10px] font-medium uppercase tracking-widest opacity-40 ${currentTheme.text}`}
            >
              of {totalPages}
            </span>
          </div>

          <div
            className={`w-32 sm:w-48 h-0.5 ${progressTrackBgClass} mt-2 overflow-hidden`}
          >
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentPage / totalPages) * 100}%` }}
            />
          </div>

          <AnimatePresence>
            {showPageJump && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`absolute bottom-full mb-6 w-56 max-h-72 flex flex-col rounded-md border ${currentTheme.ui} ${currentTheme.border} z-60 overflow-hidden shadow-none`}
              >
                <div className={`p-3 border-b ${currentTheme.border}`}>
                  <span
                    className={`text-[10px] font-medium uppercase tracking-[0.2em] ${currentTheme.text} opacity-40`}
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
                        className={`w-full text-left px-4 py-2 rounded-sm text-xs tracking-tight transition-all flex justify-between items-center ${
                          currentPage === p
                            ? "bg-primary text-primary-foreground font-medium"
                            : `${hoverBgClass} ${currentTheme.text}`
                        }`}
                      >
                        <span>Page {p}</span>
                        {currentPage === p && (
                          <span className="text-[10px] uppercase tracking-widest font-medium opacity-80">
                            Current
                          </span>
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
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-sm transition-colors ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : hoverBgClass
          } ${currentTheme.text}`}
        >
          <span className="hidden sm:inline text-xs font-medium uppercase tracking-widest mt-0.5">
            Next
          </span>
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.footer>
  );
}
