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
    <main className="flex-1 flex flex-col bg-white dark:bg-neutral-950 overflow-y-auto">
      <div className="p-8 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">
              Browse Categories
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
              Explore resources by discipline and specialization
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="space-y-4"
                >
                  <Skeleton className="h-40 w-full rounded-md" />
                  <div className="space-y-2 px-1">
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
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
            <div className="text-center py-24 bg-gray-50/30 dark:bg-neutral-900/10 rounded-md border border-gray-100 dark:border-neutral-800/50">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                No categories found.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
