"use client";

import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export const SearchBar: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}> = ({ placeholder = "Search your favourite books", value, onChange }) => {
  const [localValue, setLocalValue] = useState(value || "");
  const router = useRouter();

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (localValue.trim()) {
        router.push(`/app/search?q=${encodeURIComponent(localValue)}`);
      }
    }
  };

  const handleChange = (val: string) => {
    setLocalValue(val);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <div className="relative text-sm">
      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-52 md:w-96 pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200 placeholder-gray-400"
      />
    </div>
  );
};
