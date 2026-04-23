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
  } = useReader();

  const handleItemClick = (href: string) => {
    onTableOfContentsNavigate?.(href);
    // Close panel on mobile after navigation
    if (window.innerWidth < 768) {
      setIsTableOfContentsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isTableOfContentsOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTableOfContentsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60] md:hidden"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-xs">
                Table of Contents
              </h2>
              <button
                onClick={() => setIsTableOfContentsOpen(false)}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                title="Close sidebar"
              >
                <FiX className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {tableOfContentsItems.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-neutral-400 italic">
                    No table of contents available for this book.
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {tableOfContentsItems.map((item, index) => (
                    <button
                      key={`${item.href}-${index}`}
                      onClick={() => handleItemClick(item.href)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                      style={{ paddingLeft: `${item.level * 1.5 + 0.75}rem` }}
                    >
                      <span
                        className={`text-sm ${
                          item.level === 0
                            ? "font-medium text-neutral-700 dark:text-neutral-200"
                            : "text-neutral-500 dark:text-neutral-400"
                        } group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2`}
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
