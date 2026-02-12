"use client";

import { useGetCategoriesQuery } from "@/app/store/api/categoriesApi";
import { FiGrid } from "react-icons/fi";
import { Skeleton } from "@/app/components/Layout/Skeleton";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
      {isLoading
        ? Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-10 w-24 rounded-md"
            />
          ))
        : categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              className={`px-6 py-2.5 flex items-center justify-center rounded-md text-[11px] font-black uppercase tracking-widest transition-all duration-200 border ${
                activeCategory === category.slug
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 text-gray-500 dark:text-neutral-400 hover:border-gray-200 dark:hover:border-neutral-700"
              }`}
            >
              {category.name}
            </button>
          ))}
    </div>
  );
};
