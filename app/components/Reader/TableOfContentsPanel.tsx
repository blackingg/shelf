"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiX } from "react-icons/fi";
import { useReader } from "./ReaderContext";

export function TableOfContentsPanel() {
  const {
    isTableOfContentsOpen,
    setIsTableOfContentsOpen,
    tableOfContentsItems,
    onTableOfContentsNavigate,
    currentTheme,
    themeName,
  } = useReader();

  const borderClass =
    themeName === "sepia"
      ? "border-[#dccfb4]"
      : themeName === "dark"
        ? "border-[#404040]"
        : "border-gray-200";

  const mutedTextClass =
    themeName === "sepia"
      ? "text-[#8c6b5d]"
      : themeName === "dark"
        ? "text-neutral-400"
        : "text-gray-600";

  const nestedItemTextClass =
    themeName === "sepia"
      ? "text-[#8c6b5d]"
      : themeName === "dark"
        ? "text-neutral-400"
        : "text-gray-700";

  const topLevelItemTextClass =
    themeName === "sepia"
      ? "text-[#5b4636]"
      : themeName === "dark"
        ? "text-neutral-200"
        : "text-gray-900";

  const itemHoverBgClass =
    themeName === "sepia"
      ? "hover:bg-[#dccfb4]/35"
      : themeName === "dark"
        ? "hover:bg-white/5"
        : "hover:bg-black/5";

  const itemHoverTextClass =
    themeName === "sepia"
      ? "group-hover:text-[#8c6b5d]"
      : themeName === "dark"
        ? "group-hover:text-emerald-400"
        : "group-hover:text-emerald-700";

  const handleItemClick = (href: string) => {
    onTableOfContentsNavigate?.(href);
    if (window.innerWidth < 768) {
      setIsTableOfContentsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isTableOfContentsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTableOfContentsOpen(false)}
            className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-60 md:hidden"
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed top-0 left-0 bottom-0 w-80 ${currentTheme.bg} border-r ${borderClass} z-70 flex flex-col`}
          >
            <div
              className={`p-4 h-14 border-b ${borderClass} flex items-center justify-between`}
            >
              <h2
                className={`font-medium ${currentTheme.text} uppercase tracking-[0.2em] text-[10px]`}
              >
                Table of Contents
              </h2>
              <button
                onClick={() => setIsTableOfContentsOpen(false)}
                className={`p-1 ${itemHoverBgClass} rounded-sm transition-colors`}
                title="Close sidebar"
              >
                <FiX className={`w-4 h-4 ${mutedTextClass}`} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {tableOfContentsItems.length === 0 ? (
                <div className="p-8 text-center">
                  <p className={`text-xs italic font-medium ${mutedTextClass}`}>
                    No chapters identified.
                  </p>
                </div>
              ) : (
                <div className="space-y-px">
                  {tableOfContentsItems.map((item, index) => (
                    <button
                      key={`${item.href}-${index}`}
                      onClick={() => handleItemClick(item.href)}
                      className={`w-full text-left px-4 py-2.5 rounded-sm ${itemHoverBgClass} transition-colors group`}
                      style={{ paddingLeft: `${item.level * 1.25 + 1}rem` }}
                    >
                      <span
                        className={`text-xs tracking-tight ${
                          item.level === 0
                            ? `font-medium ${topLevelItemTextClass}`
                            : nestedItemTextClass
                        } ${itemHoverTextClass} line-clamp-2 transition-colors`}
                      >
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
