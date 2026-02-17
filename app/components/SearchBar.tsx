"use client";

import { FiSearch } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

import { motion, AnimatePresence } from "motion/react";

export const SearchBar: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}> = ({ placeholder = "Search books and folders", value, onChange }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = value ?? searchParams.get("q") ?? "";
  const [localValue, setLocalValue] = useState(initialValue);

  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    } else {
      const q = searchParams.get("q");
      if (q !== null) {
        setLocalValue(q);
      }
    }
  }, [value, searchParams]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localValue.trim()) {
      router.push(`/app/search?q=${encodeURIComponent(localValue.trim())}`);
      setIsExpanded(false);
    }
  };

  const handleChange = (val: string) => {
    setLocalValue(val);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <>
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2.5 text-gray-500 hover:text-primary transition-colors absolute left-17 top-1/2 -translate-y-1/2"
          aria-label="Open search"
        >
          <FiSearch className="w-6 h-6" />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <div className="fixed inset-0 z-60 flex items-start justify-center pt-20 px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={() => setIsExpanded(false)}
              />
              <motion.form
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.8,
                }}
                onSubmit={handleSubmit}
                className="relative w-full max-w-2xl"
              >
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={localValue}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 py-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-lg font-medium shadow-2xl transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-neutral-800 px-1.5 py-1 rounded"
                  >
                    ESC
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>
      </div>

      <form
        onSubmit={handleSubmit}
        className="hidden lg:block relative text-sm"
      >
        <button
          type="submit"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors z-10"
        >
          <FiSearch className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-96 lg:w-[40rem] pl-12 pr-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-neutral-500"
        />
      </form>
    </>
  );
};
