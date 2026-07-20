"use client";

import { FiSearch, FiX } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDebounce } from "@/app/hooks";

/**
 * Full-width search input shown at the top of /search below `lg`,
 * where the header SearchBar is hidden. Syncs the `q` param live.
 */
export const MobileSearchField: React.FC<{ placeholder?: string }> = ({
  placeholder = "Search Shelf...",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [localValue, setLocalValue] = useState(urlQuery);
  const debouncedValue = useDebounce(localValue, 400);

  const userIsTyping = React.useRef(false);

  useEffect(() => {
    // Only sync typed input to the URL; prevents stale debouncedValue
    // from clearing the query on back navigation.
    if (!userIsTyping.current) return;
    userIsTyping.current = false;

    if (debouncedValue !== (searchParams.get("q") ?? "")) {
      const params = new URLSearchParams(searchParams);
      if (debouncedValue.trim()) {
        params.set("q", debouncedValue.trim());
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      router.push(`/search?${params.toString()}`);
    }
  }, [debouncedValue, router, searchParams]);

  useEffect(() => {
    setLocalValue(urlQuery);
  }, [urlQuery]);

  const handleChange = (val: string) => {
    userIsTyping.current = true;
    setLocalValue(val);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="lg:hidden relative mb-6"
      role="search"
    >
      <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-faint pointer-events-none" />
      <input
        type="search"
        enterKeyHint="search"
        autoFocus={!urlQuery}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-11 py-3 bg-inset border border-line text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder-faint [&::-webkit-search-cancel-button]:hidden"
      />
      {localValue && (
        <button
          type="button"
          onClick={() => handleChange("")}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 text-muted active:bg-pressed rounded-md"
          aria-label="Clear search"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </form>
  );
};
