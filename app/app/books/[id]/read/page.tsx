"use client";
import React, { useState, useEffect, useRef, ChangeEvent, useContext } from "react";
import { FileBufferContext } from "@/app/context/FileBufferContext";
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
import { RenderEPub } from "@/app/app/upload-and-read/page";

export default function ReaderPage() {
  const router = useRouter();
  const params = useParams();
  const {id} = params
  const {buffer, updateBuffer} = useContext(FileBufferContext)
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light")
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Mock content (could be fetched based on params.id)
  

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

async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const files: FileList | null = e.target.files;
    const file = files ? files[0] : null;
    if (file) {
      const buffer = await file.arrayBuffer();
      updateBuffer(buffer)
    }
  }
/*
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
*/

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
/*
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
*/

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
            <div className="block">
              <h1 className={`font-bold text-lg ${currentTheme.text}`}>
                {id}
              </h1>
              <p className={`text-xs opacity-70 ${currentTheme.text}`}>
                Author Name
              </p>
            </div>
             <label
              htmlFor="file"
              className="p-2 rounded-lg text-white h-12  bg-emerald-500 grid col-span-2 items-center justify-center "
            >
              <span className="text-center w-full">Upload Book Here</span>
              <input
                type="file"
                name="file"
                id="file"
                accept=".epub"
                style={{
                  visibility: "hidden",
                  height: 0,
                }}
                onChange={handleFileUpload}
              />
            </label>  
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
                    className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-xl border p-4 z-70 ${currentTheme.ui}`}
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
                                  : "border-gray-200 dark:border-neutral-700 hover:border-gray-300"
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
        className="grid w-full justify-center md:my-4 px-6 py-6 md:py-12 cursor-text"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: `${fontSize}px`, lineHeight: "1.8" }}
          className={`${currentTheme.text} font-serif`}
        >

          <RenderEPub buffer={buffer} />
          
        </motion.div>
      </main>

      {/*
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
      </motion.footer> */}
    </div>
  );
}
