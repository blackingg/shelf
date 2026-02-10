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
    <div className="flex items-center space-x-3 overflow-x-auto pb-4 no-scrollbar">
      <button
        onClick={() => onCategoryChange("all")}
        className={`px-5 py-2 flex items-center justify-center rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
          activeCategory === "all"
            ? "bg-emerald-600 text-white shadow-lg"
            : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
        }`}
      >
        All Resources
      </button>

      {isLoading
        ? Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-10 w-24 rounded-2xl"
            />
          ))
        : categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              className={`px-5 py-2 flex items-center justify-center rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                activeCategory === category.slug
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
              }`}
            >
              {category.name}
            </button>
          ))}

      <button className="flex items-center justify-center p-2 rounded-xl bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all duration-200">
        <FiGrid className="w-5 h-5" />
      </button>
    </div>
  );
};
