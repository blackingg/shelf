"use client";

import { useState } from "react";
import { FiGrid } from "react-icons/fi";
import { CATEGORIES } from "@/app/types/categories";

export const CategoryFilter: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className={`grid  grid-cols-4 md:grid-cols-9 gap-2 items-center space-x-3 overflow-x-auto pb-2`}>
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
          className={`px-5 py-2 flex items-center justify-center rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
            activeCategory === category.id
              ? "bg-emerald-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </button>
      ))}
      <button className="flex items-center justify-center p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200">
        <FiGrid className="w-5 h-5" />
      </button>
    </div>
  );
};
