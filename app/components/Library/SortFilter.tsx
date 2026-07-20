"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiFilter, FiChevronDown, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { Sheet } from "../Shared/Sheet";

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

  const select = (val: string) => {
    onValueChange(val);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-gray-50/50 dark:bg-neutral-900/40 px-4 py-[11px] rounded-md border border-line-subtle transition-all hover:bg-gray-100 dark:hover:bg-neutral-800 group"
      >
        <FiFilter
          className={`w-3.5 h-3.5 ${isOpen ? "text-emerald-500" : "text-gray-400 group-hover:text-emerald-500"} transition-colors`}
        />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-faint">
            {labelPrefix}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-neutral-200">
            {selectedOption?.label}
          </span>
        </div>
        <FiChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Mobile: bottom sheet */}
      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={labelPrefix.replace(/:$/, "")}
      >
        <div className="py-2">
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                onClick={() => select(option.value)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left active:bg-pressed transition-colors"
              >
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  {option.label}
                </span>
                {isActive && (
                  <FiCheck className="w-4 h-4 text-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </Sheet>

      {/* Desktop: anchored dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="hidden lg:block absolute right-0 top-full mt-2 w-56 bg-background rounded-md border border-line-subtle z-50 overflow-hidden"
          >
            <div className="py-1">
              {options.map((option) => {
                const isActive = option.value === value;
                return (
                  <button
                    key={option.value}
                    onClick={() => select(option.value)}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors hover:bg-wash group`}
                  >
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${
                        isActive
                          ? "text-primary"
                          : "text-muted group-hover:text-gray-900 dark:group-hover:text-white"
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
