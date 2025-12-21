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
} from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";

export default function ReaderPage() {
  const router = useRouter();
  const params = useParams();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light");
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [totalPages] = useState(42);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Mock content (could be fetched based on params.id)
  const title = "The Psychology of Money";
  const author = "Morgan Housel";
  const chapterTitle = "Chapter 1: No One's Crazy";

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
    },
    sepia: {
      bg: "bg-[#f4ecd8]",
      text: "text-[#5b4636]",
      ui: "bg-[#f4ecd8] border-[#e3d7bf]",
      accent: "text-[#8c6b5d]",
    },
    dark: {
      bg: "bg-[#1a1a1a]",
      text: "text-[#d1d5db]",
      ui: "bg-[#262626] border-[#404040]",
      accent: "text-emerald-400",
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
                {title}
              </h1>
              <p className={`text-xs opacity-70 ${currentTheme.text}`}>
                {author}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
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
      <main
        className="flex-1 w-full max-w-3xl mx-auto px-6 py-24 md:py-32 cursor-text"
        onClick={() => setShowControls(!showControls)}
      >
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
              No One&apos;s Crazy
            </h2>
          </div>

          <p className="mb-6">
            Let me tell you about a problem. It might make you feel better about
            what you do with your money, and less judgmental about what other
            people do with theirs.
          </p>
          <p className="mb-6">
            People do some crazy things with money. But no one is crazy.
          </p>
          <p className="mb-6">
            Here&apos;s the thing: People from different generations, raised by
            different parents who earned different incomes and held different
            values, in different parts of the world, born into different
            economies, experiencing different job markets with different
            incentives and different degrees of luck, learn very different
            lessons.
          </p>
          <p className="mb-6">
            Everyone has their own unique experience with how the world works.
            And what you&apos;ve experienced is more compelling than what you
            learn second-hand. So all of us—you, me, everyone—go through life
            anchored to a set of views about how money works that vary wildly
            from person to person. What seems crazy to you might make sense to
            me.
          </p>
          <p className="mb-6">
            The person who grew up in poverty thinks about risk and reward in
            ways the child of a wealthy banker cannot fathom if he tried. The
            person who grew up when inflation was high experienced something the
            person who grew up with stable prices never had to. The stock broker
            who lost everything during the Great Depression experienced
            something the tech worker basking in the glory of the late 1990s
            can&apos;t imagine. The Australian who hasn&apos;t seen a recession
            in 30 years has experienced something the Greek worker hasn&apos;t.
          </p>
          <p className="mb-6">
            On and on. The list of experiences is endless. You know stuff about
            money that I don&apos;t, and vice versa. You go through life with
            different beliefs, goals, and forecasts, than I do. That&apos;s not
            because one of us is smarter than the other, or has better
            information. It&apos;s because we&apos;ve had different lives.
          </p>
        </motion.div>
      </main>

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
