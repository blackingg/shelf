"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiArrowLeft,
  FiMaximize,
  FiMinimize,
  FiChevronLeft,
  FiChevronRight,
  FiType,
  FiMoon,
  FiSun,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
} from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import { useNotifications } from "@/app/context/NotificationContext";

export default function ModeratorReaderPage() {
  const router = useRouter();
  const params = useParams();
  const bookSlug = params.slug as string;
  const { addNotification } = useNotifications();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light");
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [totalPages] = useState(42);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Mock content
  const title = "Introduction to Algorithms";
  const author = "Thomas H. Cormen";
  const chapterTitle = "Chapter 1: The Role of Algorithms";

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const handleApprove = () => {
    addNotification("success", "Document Verified Successfully");
    // Simulate API call delay
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextPage();
      } else if (e.key === "ArrowLeft") {
        prevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const themes = {
    light: {
      bg: "bg-white",
      text: "text-gray-900",
      ui: "bg-white border-gray-200",
      accent: "text-emerald-700",
      panel: "bg-gray-50 border-gray-200",
    },
    sepia: {
      bg: "bg-[#f4ecd8]",
      text: "text-[#5b4636]",
      ui: "bg-[#f4ecd8] border-[#e3d7bf]",
      accent: "text-[#8c6b5d]",
      panel: "bg-[#ebe0c8] border-[#dccfb4]",
    },
    dark: {
      bg: "bg-[#1a1a1a]",
      text: "text-[#d1d5db]",
      ui: "bg-[#262626] border-[#404040]",
      accent: "text-emerald-400",
      panel: "bg-[#262626] border-[#404040]",
    },
  };

  const currentTheme = themes[theme];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${currentTheme.bg}`}
    >
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: showControls ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 w-full z-50 border-b ${currentTheme.ui} shadow-sm backdrop-blur-md bg-opacity-90`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className={`p-2 rounded-full hover:bg-black/5 transition-colors ${currentTheme.text}`}
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <div className="hidden md:block">
              <h1 className={`font-bold text-lg ${currentTheme.text}`}>
                <span className="opacity-70 font-normal">Reviewing:</span>{" "}
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowReviewPanel(!showReviewPanel)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all font-medium ${
                showReviewPanel
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : `border ${currentTheme.ui} ${currentTheme.text} hover:bg-black/5`
              }`}
            >
              <FiMessageSquare className="w-5 h-5" />
              <span className="hidden sm:inline">Review Panel</span>
            </button>

            <div className="w-px h-6 bg-gray-300 dark:bg-neutral-800 mx-2" />

            <div
              className="relative"
              ref={settingsRef}
            >
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-full hover:bg-black/5 transition-colors ${currentTheme.text}`}
              >
                <FiType className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-xl border p-4 z-[70] ${currentTheme.ui}`}
                  >
                    <div className="space-y-4">
                      <div>
                        <label
                          className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${currentTheme.text}`}
                        >
                          Theme
                        </label>
                        <div className="flex space-x-2">
                          {(["light", "sepia", "dark"] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setTheme(t)}
                              className={`flex-1 py-2 rounded-lg border flex items-center justify-center space-x-2 transition-all ${
                                theme === t
                                  ? "ring-2 ring-emerald-500 border-transparent"
                                  : "border-gray-200 hover:border-gray-300"
                              } ${
                                t === "light"
                                  ? "bg-white text-gray-900"
                                  : t === "sepia"
                                    ? "bg-[#f4ecd8] text-[#5b4636]"
                                    : "bg-[#1a1a1a] text-white"
                              }`}
                            >
                              {t === "light" && <FiSun className="w-4 h-4" />}
                              {t === "dark" && <FiMoon className="w-4 h-4" />}
                              <span className="capitalize">{t}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label
                          className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${currentTheme.text}`}
                        >
                          Font Size
                        </label>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              setFontSize(Math.max(14, fontSize - 2))
                            }
                            className={`p-2 rounded-lg border hover:bg-black/5 ${currentTheme.ui} ${currentTheme.text}`}
                          >
                            A-
                          </button>
                          <div className="flex-1">
                            <input
                              type="range"
                              min="14"
                              max="32"
                              value={fontSize}
                              onChange={(e) =>
                                setFontSize(Number(e.target.value))
                              }
                              className="w-full accent-emerald-600"
                            />
                          </div>
                          <button
                            onClick={() =>
                              setFontSize(Math.min(32, fontSize + 2))
                            }
                            className={`p-2 rounded-lg border hover:bg-black/5 ${currentTheme.ui} ${currentTheme.text}`}
                          >
                            A+
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={toggleFullScreen}
              className={`p-2 rounded-full hover:bg-black/5 transition-colors ${currentTheme.text}`}
            >
              {isFullScreen ? (
                <FiMinimize className="w-5 h-5" />
              ) : (
                <FiMaximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 relative">
        <main
          className={`flex-1 w-full mx-auto px-6 py-24 md:py-32 cursor-text transition-all duration-300 ${showReviewPanel ? "md:pr-[320px]" : ""}`}
          onClick={() => setShowControls(!showControls)}
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: `${fontSize}px`, lineHeight: "1.8" }}
              className={`${currentTheme.text} font-serif`}
            >
              <div className="text-center mb-12">
                <span
                  className={`text-sm font-sans uppercase tracking-widest opacity-60 ${currentTheme.text}`}
                >
                  {chapterTitle}
                </span>
                <h2 className="text-4xl font-bold mt-4 mb-8">
                  The Role of Algorithms in Computing
                </h2>
              </div>

              <p className="mb-6">
                What are algorithms? Why is the study of algorithms worthwhile?
                What is the role of algorithms relative to other technologies
                used in computers? In this chapter, we will answer these
                questions.
              </p>
              <p className="mb-6">
                Informally, an algorithm is any well-defined computational
                procedure that takes some value, or set of values, as input and
                produces some value, or set of values, as output. An algorithm
                is thus a sequence of computational steps that transform the
                input into the output.
              </p>
              <p className="mb-6">
                We can also view an algorithm as a tool for solving a
                well-specified computational problem. The statement of the
                problem specifies in general terms the desired input/output
                relationship. The algorithm describes a specific computational
                procedure for achieving that input/output relationship.
              </p>
              <p className="mb-6">
                For example, we might need to sort a sequence of numbers into
                nondecreasing order. This problem arises frequently in practice
                and provides fertile ground for introducing many standard design
                techniques and analysis tools. Here is how we formally define
                the sorting problem:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <strong>Input:</strong> A sequence of n numbers (a1, a2, ...,
                  an).
                </li>
                <li>
                  <strong>Output:</strong> A permutation (reordering) (a'1, a'2,
                  ..., a'n) of the input sequence such that a'1 ≤ a'2 ≤ ... ≤
                  a'n.
                </li>
              </ul>
              <p className="mb-6">
                For example, given the input sequence (31, 41, 59, 26, 41, 58),
                a sorting algorithm returns as output the sequence (26, 31, 41,
                41, 58, 59). Such an input sequence is called an instance of the
                sorting problem. In general, an instance of a problem consists
                of the input (satisfying whatever constraints are imposed in the
                problem statement) needed to compute a solution to the problem.
              </p>
              <p className="mb-6">
                An algorithm is said to be correct if, for every input instance,
                it halts with the correct output. We say that a correct
                algorithm solves the given computational problem. An incorrect
                algorithm might not halt at all on some input instances, or it
                might halt with an incorrect answer. Contrary to what one might
                expect, incorrect algorithms can sometimes be useful, if their
                error rate can be controlled.
              </p>
            </motion.div>
          </div>
        </main>

        {/* Review Panel */}
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
                      Does the content match the description and quality
                      standards?
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
      </div>

      <motion.footer
        initial={{ y: 100 }}
        animate={{ y: showControls ? 0 : 100 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-0 w-full z-50 border-t ${currentTheme.ui} backdrop-blur-md bg-opacity-90`}
      >
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={prevPage}
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
            onClick={nextPage}
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
    </div>
  );
}
