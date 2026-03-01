"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiFilter, FiChevronDown, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";

interface SortOption {
  value: string;
  label: string;
}

interface SortFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SortOption[];
  className?: string;
  labelPrefix?: string;
}

export const SortFilter: React.FC<SortFilterProps> = ({
  value,
  onValueChange,
  options,
  className = "",
  labelPrefix = "Sort by:",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative ${className}`}
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-gray-50/50 dark:bg-neutral-900/40 px-4 py-[11px] rounded-md border border-gray-100 dark:border-neutral-800 transition-all hover:bg-gray-100 dark:hover:bg-neutral-800 group"
      >
        <FiFilter
          className={`w-3.5 h-3.5 ${isOpen ? "text-emerald-500" : "text-gray-400 group-hover:text-emerald-500"} transition-colors`}
        />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
            {labelPrefix}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-neutral-200">
            {selectedOption?.label}
          </span>
        </div>
        <FiChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-neutral-800 z-50 overflow-hidden"
          >
            <div className="py-1">
              {options.map((option) => {
                const isActive = option.value === value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onValueChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5 group`}
                  >
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        isActive
                          ? "text-emerald-600 dark:text-emerald-500"
                          : "text-gray-500 dark:text-neutral-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      }`}
                    >
                      {option.label}
                    </span>
                    {isActive && (
                      <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
