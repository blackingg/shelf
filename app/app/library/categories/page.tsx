"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/app/components/Library/PageHeader";
import { CategoryCard } from "@/app/components/Library/CategoryCard";
import { FiGrid } from "react-icons/fi";
import { CATEGORIES } from "@/app/types/categories";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  return (
    <main className="flex-1 overflow-y-auto">
      <PageHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <FiGrid className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Available Categories
            </h1>
          </div>
          <p className="text-gray-600">
            Browse books by your favorite genres and topics
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() =>
                router.push(`/app/library/categories/${category.id}`)
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
}
