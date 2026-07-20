"use client";
import { useRouter } from "next/navigation";
import { CategoryCard } from "@/app/components/Library/CategoryCard";
import { useCategories } from "@/app/services";
import { Skeleton } from "@/app/components/Layout/Skeleton";
import { useOpenPanel } from "@openpanel/nextjs";

export default function CategoriesPage() {
  const router = useRouter();
  const openPanel = useOpenPanel();
  const { categories, isLoading } = useCategories();

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-8 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tighter mb-2">
              Browse Categories
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-faint">
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
                  onClick={() => {
                    openPanel.track("category_clicked", {
                      categorySlug: category.slug,
                      categoryName: category.name,
                      source: "categories_page",
                    });
                    router.push(`/library/categories/${category.slug}`);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-50/30 dark:bg-neutral-900/10 rounded-md border border-line-subtle">
              <p className="text-[11px] font-bold uppercase tracking-widest text-faint">
                No categories found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
