"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import { useGetUserByUsernameQuery } from "@/app/store/api/usersApi";
import { UserMinimal } from "@/app/types/user";

interface UserSearchInputProps {
  onSelect: (user: UserMinimal) => void;
  excludeUserIds?: string[];
  placeholder?: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function UserSearchInput({
  onSelect,
  excludeUserIds = [],
  placeholder = "Search by username...",
}: UserSearchInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query.trim(), 400);

  const {
    data: foundUser,
    isFetching,
    isError,
  } = useGetUserByUsernameQuery(debouncedQuery, {
    skip: debouncedQuery.length < 2,
  });

  const isExcluded = foundUser ? excludeUserIds.includes(foundUser.id) : false;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (user: UserMinimal) => {
      onSelect(user);
      setQuery("");
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onSelect],
  );

  const showDropdown = isOpen && debouncedQuery.length >= 2;

  return (
    <div
      ref={containerRef}
      className="relative flex-1"
    >
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-neutral-700 focus:border-emerald-500 bg-white dark:bg-neutral-900 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 transition-colors"
        />
        {isFetching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-md shadow-lg overflow-hidden">
          {isFetching ? (
            <div className="flex items-center space-x-3 px-4 py-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-md flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-28" />
                <div className="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-20" />
              </div>
            </div>
          ) : foundUser && !isExcluded ? (
            <button
              type="button"
              onClick={() =>
                handleSelect({
                  id: foundUser.id,
                  username: foundUser.username,
                  fullName: foundUser.fullName,
                  avatar: foundUser.avatar,
                })
              }
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left"
            >
              {foundUser.avatar ? (
                <img
                  src={foundUser.avatar}
                  alt={foundUser.username}
                  className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-md flex items-center justify-center text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20 uppercase flex-shrink-0">
                  {foundUser.fullName?.[0] || foundUser.username?.[0] || "?"}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {foundUser.fullName}
                </p>
                <p className="text-xs text-gray-400 dark:text-neutral-500 truncate">
                  @{foundUser.username}
                </p>
              </div>
            </button>
          ) : (
            <div className="px-4 py-5 text-center">
              <FiUser className="w-5 h-5 text-gray-300 dark:text-neutral-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-neutral-500">
                {isExcluded
                  ? "User is already a collaborator"
                  : `No user found with username "${debouncedQuery}"`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
