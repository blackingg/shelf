"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiArrowLeft,
  FiMaximize,
  FiMinimize,
  FiType,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import {
  ReaderThemeColors,
  ReaderThemeName,
  readerThemes,
} from "./readerThemes";

interface ReaderHeaderProps {
  title: string;
  subtitle?: string;
  titlePrefix?: string;
  theme: ReaderThemeName;
  currentTheme: ReaderThemeColors;
  fontSize: number;
  showControls: boolean;
  isFullScreen: boolean;
  onThemeChange: (theme: ReaderThemeName) => void;
  onFontSizeChange: (size: number) => void;
  onToggleFullScreen: () => void;
  /** Extra action buttons rendered before the settings button */
  extraActions?: React.ReactNode;
}

export function ReaderHeader({
  title,
  subtitle,
  titlePrefix,
  theme,
  currentTheme,
  fontSize,
  showControls,
  isFullScreen,
  onThemeChange,
  onFontSizeChange,
  onToggleFullScreen,
  extraActions,
}: ReaderHeaderProps) {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

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

  return (
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
              {titlePrefix && (
                <span className="opacity-70 font-normal">{titlePrefix} </span>
              )}
              {title}
            </h1>
            {subtitle && (
              <p className={`text-xs opacity-70 ${currentTheme.text}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {extraActions}

          {extraActions && (
            <div className="w-px h-6 bg-gray-300 dark:bg-neutral-800 mx-2" />
          )}

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
                            onClick={() => onThemeChange(t)}
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
                            onFontSizeChange(Math.max(14, fontSize - 2))
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
                              onFontSizeChange(Number(e.target.value))
                            }
                            className="w-full accent-emerald-600"
                          />
                        </div>
                        <button
                          onClick={() =>
                            onFontSizeChange(Math.min(32, fontSize + 2))
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
            onClick={onToggleFullScreen}
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
  );
}
