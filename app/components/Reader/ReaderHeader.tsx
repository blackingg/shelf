"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  FiArrowLeft,
  FiMaximize,
  FiMinimize,
  FiType,
  FiMoon,
  FiSun,
  FiList,
  FiZoomIn,
} from "react-icons/fi";
import { useReader } from "./ReaderContext";
import { ReaderThemeName, readerThemes } from "./readerThemes";

interface ReaderHeaderProps {
  title: string;
  subtitle?: string;
  titlePrefix?: string;
  showControls: boolean;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
  extraActions?: React.ReactNode;
}

export function ReaderHeader({
  title,
  subtitle,
  titlePrefix,
  showControls,
  isFullScreen,
  onToggleFullScreen,
  extraActions,
}: ReaderHeaderProps) {
  const {
    themeName,
    setTheme,
    fontSize,
    setFontSize,
    pdfScale,
    setPdfScale,
    tableOfContentsItems,
    isTableOfContentsOpen,
    setIsTableOfContentsOpen,
    currentTheme,
    format,
  } = useReader();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);

  const toggleTheme = () => {
    const themes: ReaderThemeName[] = ["light", "sepia", "dark"];
    const currentIndex = themes.indexOf(themeName);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <AnimatePresence>
      {showControls && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className={`fixed top-0 left-0 right-0 z-50 h-16 border-b transition-colors duration-300 ${currentTheme.bg} ${currentTheme.border} flex items-center justify-between px-4`}
        >
          {/* Left side: Back button & Title */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <button
              onClick={() => router.back()}
              className={`p-2 rounded-full hover:bg-black/5 transition-colors ${currentTheme.text}`}
              title="Go back"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0 hidden sm:block">
              <h1 className={`text-sm font-semibold truncate ${currentTheme.text}`}>
                {titlePrefix && <span className="opacity-50 mr-1">{titlePrefix}</span>}
                {title}
              </h1>
              {subtitle && (
                <p className={`text-xs opacity-60 truncate ${currentTheme.text}`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Format-Specific Settings: EPUB (Theme/Font) or PDF (Zoom) */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-full transition-colors ${
                  showSettings ? "bg-emerald-500 text-white" : `hover:bg-black/5 ${currentTheme.text}`
                }`}
                title="Reader Settings"
              >
                {format === "pdf" ? <FiZoomIn className="w-5 h-5" /> : <FiType className="w-5 h-5" />}
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 mt-2 w-72 p-4 rounded-xl shadow-2xl border ${currentTheme.bg} ${currentTheme.border} z-[60]`}
                  >
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 opacity-50 ${currentTheme.text}`}>
                      {format === "pdf" ? "PDF View Settings" : "Typography & Theme"}
                    </h3>

                    {format === "epub" && (
                      <>
                        {/* Theme Selection */}
                        <div className="flex justify-between gap-2 mb-6">
                          {(["light", "sepia", "dark"] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setTheme(t)}
                              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                                themeName === t
                                  ? "border-emerald-500 bg-emerald-500/5"
                                  : "border-transparent hover:bg-black/5"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full border shadow-sm ${readerThemes[t].bg} ${readerThemes[t].border} flex items-center justify-center`}>
                                {t === "light" && <FiSun className="w-4 h-4 text-orange-400" />}
                                {t === "sepia" && <FiSun className="w-4 h-4 text-amber-600" />}
                                {t === "dark" && <FiMoon className="w-4 h-4 text-indigo-400" />}
                              </div>
                              <span className={`text-[10px] capitalize font-medium ${currentTheme.text}`}>{t}</span>
                            </button>
                          ))}
                        </div>

                        {/* Font Size Slider */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className={`text-xs font-medium ${currentTheme.text}`}>Font Size</span>
                            <span className={`text-xs font-mono bg-black/5 px-2 py-0.5 rounded ${currentTheme.text}`}>{fontSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="12"
                            max="32"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      </>
                    )}

                    {format === "pdf" && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-medium ${currentTheme.text}`}>Page Scale</span>
                          <span className={`text-xs font-mono bg-black/5 px-2 py-0.5 rounded ${currentTheme.text}`}>{pdfScale.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2.5"
                          step="0.1"
                          value={pdfScale}
                          onChange={(e) => setPdfScale(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="flex justify-between text-[10px] opacity-40 px-1">
                          <span>0.5x</span>
                          <span>1.0x</span>
                          <span>2.5x</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-neutral-800 mx-2" />

            {/* Table of Contents button — only show when Table of Contents data exists */}
            {tableOfContentsItems.length > 0 && (
              <button
                onClick={() => setIsTableOfContentsOpen(!isTableOfContentsOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isTableOfContentsOpen
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : `text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${currentTheme.text}`
                }`}
                title={isTableOfContentsOpen ? "Close Table of Contents" : "Open Table of Contents"}
              >
                <FiList className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onToggleFullScreen}
              className={`p-2 rounded-full hover:bg-black/5 transition-colors ${currentTheme.text}`}
              title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullScreen ? <FiMinimize className="w-5 h-5" /> : <FiMaximize className="w-5 h-5" />}
            </button>

            {extraActions}
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
