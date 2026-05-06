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

  const hoverBgClass =
    themeName === "sepia"
      ? "hover:bg-[#dccfb4]/35"
      : themeName === "dark"
        ? "hover:bg-white/5"
        : "hover:bg-black/5";

  const sliderTrackBgClass =
    themeName === "sepia"
      ? "bg-[#dccfb4]/70"
      : themeName === "dark"
        ? "bg-white/10"
        : "bg-black/10";

  const dividerBgClass =
    themeName === "sepia"
      ? "bg-[#dccfb4]"
      : themeName === "dark"
        ? "bg-[#404040]"
        : "bg-gray-200";

  return (
    <AnimatePresence>
      {showControls && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className={`fixed top-0 left-0 right-0 z-50 h-14 border-b transition-colors duration-300 ${currentTheme.bg} ${currentTheme.border} flex items-center justify-between px-4`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={() => router.back()}
              className={`p-2 rounded-sm ${hoverBgClass} transition-colors ${currentTheme.text}`}
              title="Go back"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0 hidden sm:block ml-2">
              <h1
                className={`text-sm font-medium truncate ${currentTheme.text} tracking-tight`}
              >
                {titlePrefix && (
                  <span className="opacity-40 mr-1 font-normal">
                    {titlePrefix}
                  </span>
                )}
                {title}
              </h1>
              {subtitle && (
                <p
                  className={`text-[10px] opacity-40 truncate ${currentTheme.text} uppercase tracking-wider`}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-sm transition-colors ${
                  showSettings
                    ? "bg-primary text-primary-foreground"
                    : `${hoverBgClass} ${currentTheme.text}`
                }`}
                title="Reader Settings"
              >
                {format === "pdf" ? (
                  <FiZoomIn className="w-5 h-5" />
                ) : (
                  <FiType className="w-5 h-5" />
                )}
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className={`absolute right-0 mt-2 w-72 p-6 rounded-md border ${currentTheme.bg} ${currentTheme.border} z-60`}
                  >
                    <h3
                      className={`text-[10px] font-medium uppercase tracking-[0.2em] mb-6 opacity-40 ${currentTheme.text}`}
                    >
                      {format === "pdf"
                        ? "PDF View Settings"
                        : "Typography & Theme"}
                    </h3>

                    {format === "epub" && (
                      <>
                        <div className="flex justify-between gap-3 mb-8">
                          {(["light", "sepia", "dark"] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setTheme(t)}
                              className={`flex-1 flex flex-col items-center gap-2 p-2 rounded-sm border transition-all ${
                                themeName === t
                                  ? "border-primary bg-primary/5 shadow-[0_0_0_1px_rgba(var(--primary-rgb),0.5)]"
                                  : `border-transparent ${hoverBgClass}`
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-sm border ${readerThemes[t].bg} ${readerThemes[t].border} flex items-center justify-center`}
                              >
                                {t === "light" && (
                                  <FiSun className="w-3.5 h-3.5 text-orange-400" />
                                )}
                                {t === "sepia" && (
                                  <FiSun className="w-3.5 h-3.5 text-amber-600" />
                                )}
                                {t === "dark" && (
                                  <FiMoon className="w-3.5 h-3.5 text-indigo-400" />
                                )}
                              </div>
                              <span
                                className={`text-[10px] capitalize font-medium tracking-wide ${currentTheme.text}`}
                              >
                                {t}
                              </span>
                            </button>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span
                              className={`text-[10px] uppercase font-medium tracking-widest opacity-40 ${currentTheme.text}`}
                            >
                              Font Size
                            </span>
                            <span
                              className={`text-xs font-medium ${currentTheme.text}`}
                            >
                              {fontSize}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="12"
                            max="32"
                            value={fontSize}
                            onChange={(e) =>
                              setFontSize(parseInt(e.target.value))
                            }
                            className={`w-full h-1 ${sliderTrackBgClass} rounded-none appearance-none cursor-pointer accent-primary`}
                          />
                        </div>
                      </>
                    )}

                    {format === "pdf" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-[10px] uppercase font-medium tracking-widest opacity-40 ${currentTheme.text}`}
                          >
                            Page Scale
                          </span>
                          <span
                            className={`text-xs font-medium ${currentTheme.text}`}
                          >
                            {pdfScale.toFixed(1)}x
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2.5"
                          step="0.1"
                          value={pdfScale}
                          onChange={(e) =>
                            setPdfScale(parseFloat(e.target.value))
                          }
                          className={`w-full h-1 ${sliderTrackBgClass} rounded-none appearance-none cursor-pointer accent-primary`}
                        />
                        <div className="flex justify-between text-[8px] uppercase tracking-widest opacity-20 px-1">
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

            <div className={`w-px h-4 ${dividerBgClass} mx-2`} />

            {tableOfContentsItems.length > 0 && (
              <button
                onClick={() => setIsTableOfContentsOpen(!isTableOfContentsOpen)}
                className={`p-2 rounded-sm transition-all duration-300 ${
                  isTableOfContentsOpen
                    ? "bg-primary text-primary-foreground"
                    : `${hoverBgClass} ${currentTheme.text}`
                }`}
                title={
                  isTableOfContentsOpen
                    ? "Close Table of Contents"
                    : "Open Table of Contents"
                }
              >
                <FiList className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onToggleFullScreen}
              className={`p-2 rounded-sm ${hoverBgClass} transition-colors ${currentTheme.text}`}
              title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullScreen ? (
                <FiMinimize className="w-5 h-5" />
              ) : (
                <FiMaximize className="w-5 h-5" />
              )}
            </button>

            {extraActions}
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
