"use client";

import { FiSearch } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

export const SearchBar: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}> = ({ placeholder = "Search books and folders", value, onChange }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = value ?? searchParams.get("q") ?? "";
  const [localValue, setLocalValue] = useState(initialValue);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localValue.trim()) {
      router.push(`/app/search?q=${encodeURIComponent(localValue.trim())}`);
    }
  };

  const handleChange = (val: string) => {
    setLocalValue(val);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative text-sm left-12 lg:left-0"
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
        className="w-46 md:w-96 lg:w-[40rem] pl-12 pr-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-neutral-500"
      />
    </form>
  );
};
