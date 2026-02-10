"use client";
import { useRouter } from "next/navigation";
import { CategoryCard } from "@/app/components/Library/CategoryCard";
import { useGetCategoriesQuery } from "@/app/store/api/categoriesApi";
import { Skeleton } from "@/app/components/Layout/Skeleton";
import { FiArrowLeft, FiTag } from "react-icons/fi";

export default function CategoriesPage() {
  const router = useRouter();
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  return (
    <main className="flex-1 flex flex-col bg-gray-50 dark:bg-neutral-900 overflow-y-auto">
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

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="space-y-4"
              >
                <Skeleton className="h-40 w-full rounded-4xl" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() =>
                  router.push(`/app/library/categories/${category.slug}`)
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-neutral-800 rounded-[3rem] border border-gray-100 dark:border-neutral-700">
            <p className="text-gray-500">No categories found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
