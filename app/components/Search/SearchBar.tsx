"use client";

import { FiSearch } from "react-icons/fi";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDebounce } from "@/app/hooks";

export const SearchBar: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}> = ({ placeholder = "Search Shelf...", value, onChange }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialValue = value ?? searchParams.get("q") ?? "";
  const [localValue, setLocalValue] = useState(initialValue);
  const debouncedValue = useDebounce(localValue, 400);

  const userIsTyping = React.useRef(false);

  useEffect(() => {
    // Only perform live search if the user actively typed something.
    // This prevents stale debouncedValue from clearing the URL on back navigation.
    if (!userIsTyping.current) return;
    userIsTyping.current = false;

    if (
      pathname === "/search" &&
      debouncedValue !== (searchParams.get("q") ?? "")
    ) {
      const params = new URLSearchParams(searchParams);
      if (debouncedValue.trim()) {
        params.set("q", debouncedValue.trim());
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      router.push(`/search?${params.toString()}`);
    }
  }, [debouncedValue, pathname, router, searchParams]);

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    } else if (pathname === "/search") {
      const q = searchParams.get("q");
      setLocalValue(q ?? "");
    } else {
      setLocalValue("");
    }
  }, [value, searchParams, pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localValue.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set("q", localValue.trim());
      params.set("page", "1"); // Reset to page 1 on search
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleChange = (val: string) => {
    userIsTyping.current = true;
    setLocalValue(val);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden lg:block relative text-sm"
    >
      <button
        type="submit"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-faint hover:text-primary transition-colors z-10"
      >
        <FiSearch className="w-5 h-5" />
      </button>
      <input
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-96 lg:w-160 pl-12 pr-4 py-3 bg-inset border border-line text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-transparent transition-all duration-200 placeholder-faint"
      />
    </form>
  );
};
