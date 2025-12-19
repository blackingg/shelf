"use client";
import { useRouter } from "next/navigation";
import { CategoryCard } from "@/app/components/Library/CategoryCard";
import { CATEGORIES } from "@/app/types/categories";

export default function CategoriesPage() {
  const router = useRouter();

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Available Categories
            </h1>
          </div>
          <p className="text-gray-600">
            Browse books by your favorite genres and topics
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
