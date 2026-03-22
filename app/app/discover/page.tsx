"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryFilter } from "@/app/components/Library/CategoryFilter";
import { BookCard, BookCardSkeleton } from "@/app/components/Library/BookCard";
import {
  FolderCard,
  FolderCardSkeleton,
} from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiBook } from "react-icons/fi";
import { BookPreview } from "@/app/types/book";
import { Folder } from "@/app/types/folder";
import { useGetDiscoverFeedQuery } from "@/app/store/api/recommendationsApi";
import { useGetBooksByCategoryQuery } from "@/app/store/api/categoriesApi";
import { useGetDepartmentsQuery } from "@/app/store/api/departmentsApi";
import { useGetPublicFoldersQuery } from "@/app/store/api/foldersApi";
import {
  DepartmentCard,
  DepartmentCardSkeleton,
} from "@/app/components/Library/DepartmentCard";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store/authSlice";
import { watchResponsiveGridFetchLimit } from "@/app/helpers/responsive";

type RecommendedItem =
  | (BookPreview & { type: "book" })
  | (Folder & { type: "folder" });

export default function DiscoverPage() {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [categoryFetchLimit, setCategoryFetchLimit] = useState(10);
  const [departmentDisplayLimit, setDepartmentDisplayLimit] = useState(8);
  const [publicFoldersFetchLimit, setPublicFoldersFetchLimit] = useState(8);

  useEffect(() => {
    const stopCategoryWatch = watchResponsiveGridFetchLimit(
      { base: 2, md: 3, lg: 5 },
      setCategoryFetchLimit,
      2,
    );

    const stopDepartmentWatch = watchResponsiveGridFetchLimit(
      { base: 2, md: 3, lg: 4 },
      setDepartmentDisplayLimit,
      2,
    );

    const stopPublicFoldersWatch = watchResponsiveGridFetchLimit(
      { base: 2, md: 3, lg: 4 },
      setPublicFoldersFetchLimit,
      2,
    );

    return () => {
      stopCategoryWatch();
      stopDepartmentWatch();
      stopPublicFoldersWatch();
    };
  }, []);

  const { data: recommendations, isLoading: isLoadingRecommendations } =
    useGetDiscoverFeedQuery();

  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
    isFetching: isFetchingDepartments,
  } = useGetDepartmentsQuery(
    user?.school?.id ? { school_id: user.school.id } : undefined,
  );

  const { data: publicFoldersResponse, isLoading: isLoadingPublicFolders } =
    useGetPublicFoldersQuery({
      page: 1,
      limit: publicFoldersFetchLimit,
      sort_by: "createdAt",
      order: "desc",
    });

  const displayDepartments = useMemo(
    () =>
      [...departments]
        .sort((a, b) => {
          const booksDiff = (b.booksCount || 0) - (a.booksCount || 0);
          if (booksDiff !== 0) return booksDiff;
          return a.name.localeCompare(b.name);
        })
        .slice(0, departmentDisplayLimit),
    [departments, departmentDisplayLimit],
  );
  const hasMoreDepartments = departments.length > displayDepartments.length;
  const displayFolders = publicFoldersResponse?.items || [];
  const hasMorePublicFolders =
    !!publicFoldersResponse?.hasNext ||
    (publicFoldersResponse?.total || 0) > displayFolders.length;

  const {
    currentData: categoryBooksResult,
    isLoading: isLoadingCategoryBooks,
    isFetching: isFetchingCategoryBooks,
  } = useGetBooksByCategoryQuery({
    slug: activeCategory,
    page: 1,
    limit: categoryFetchLimit,
  });

  const categoryBooksResponse = categoryBooksResult?.books;

  const categoryBooks = categoryBooksResponse?.items || [];
  const isCategoryLoading =
    categoryBooks.length === 0 &&
    (isLoadingCategoryBooks || isFetchingCategoryBooks);
  const hasMoreCategoryBooks =
    !!categoryBooksResponse?.hasNext ||
    (categoryBooksResponse?.total || 0) > categoryBooks.length;
  const displayItems: RecommendedItem[] = [];

  const handleViewMoreCategories = () => {
    router.push(`/app/library/categories/${activeCategory}`);
  };

  if (recommendations) {
    const folders = recommendations.items
      .filter((item) => item.type === "folder")
      .map((item) => ({ ...item.data, type: "folder" as const }));

    const books = recommendations.items
      .filter((item) => item.type === "book")
      .map((item) => ({ ...item.data, type: "book" as const }));

    const maxLength = Math.max(folders.length, books.length);
    for (let i = 0; i < maxLength; i++) {
      if (i < folders.length) displayItems.push(folders[i]);
      if (i < books.length) displayItems.push(books[i]);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-full">
      <main className="p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                Discover
              </h2>
            </div>

            {isLoadingRecommendations ? (
              <div className="flex items-stretch gap-6 md:gap-8 overflow-x-auto pb-6 custom-scrollbar -mx-4 px-4 md:-mx-8 md:px-8">
                <div className="w-60 md:w-[280px] shrink-0">
                  <FolderCardSkeleton count={1} />
                </div>
                <div className="w-60 md:w-[280px] shrink-0">
                  <FolderCardSkeleton count={1} />
                </div>
                <div className="w-60 md:w-[280px] shrink-0">
                  <BookCardSkeleton count={1} />
                </div>
                <div className="w-60 md:w-[280px] shrink-0">
                  <BookCardSkeleton count={1} />
                </div>
              </div>
            ) : displayItems.length > 0 ? (
              <div className="flex items-stretch gap-8 md:gap-10 overflow-x-auto pb-6 custom-scrollbar -mx-4 px-4 md:-mx-8 md:px-8">
                {displayItems.map((item, idx) => (
                  <div
                    key={`rec-${item.type}-${item.id}-${idx}`}
                    className="w-60 md:w-[300px] shrink-0"
                  >
                    {item.type === "folder" ? (
                      <FolderCard
                        folder={item}
                        onClick={() => router.push(`/app/folders/${item.slug}`)}
                      />
                    ) : (
                      <BookCard
                        {...item}
                        onClick={() => setSelectedBook(item)}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[30vh] bg-gray-50/30 dark:bg-neutral-900/10 p-16 rounded-md border border-gray-100 dark:border-neutral-800/50 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-md flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-neutral-700/50">
                  <FiBook className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Recommendations Yet
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 max-w-xs mx-auto">
                  Start exploring to get personalized suggestions.
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                Categories
              </h2>
            </div>

            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {isCategoryLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
                <BookCardSkeleton count={categoryFetchLimit} />
              </div>
            ) : categoryBooks.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-12">
                  {categoryBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      {...book}
                      onClick={() => setSelectedBook(book as BookPreview)}
                    />
                  ))}
                </div>

                {hasMoreCategoryBooks && (
                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={handleViewMoreCategories}
                      className="px-6 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-md text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-500 hover:border-emerald-500 transition-colors"
                    >
                      View More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="min-h-144 md:min-h-176 bg-gray-50/30 dark:bg-neutral-900/10 p-24 rounded-md text-center border border-gray-100 dark:border-neutral-800/50 mt-12 flex items-center justify-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  No resources found in this category.
                </p>
              </div>
            )}
          </div>

          <div className="mt-20">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                Departments
              </h2>
            </div>

            {isLoadingDepartments || isFetchingDepartments ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: departmentDisplayLimit }).map((_, i) => (
                  <DepartmentCardSkeleton key={i} />
                ))}
              </div>
            ) : displayDepartments.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayDepartments.map((dept) => (
                    <DepartmentCard
                      key={dept.id}
                      department={dept}
                      onClick={() =>
                        router.push(`/app/library/departments/${dept.slug}`)
                      }
                    />
                  ))}
                </div>

                {hasMoreDepartments && (
                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={() => router.push("/app/library/departments")}
                      className="px-6 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-md text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-500 hover:border-emerald-500 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-[20vh] flex flex-col items-center justify-center bg-gray-50/30 dark:bg-neutral-900/10 p-8 rounded-md border border-gray-100 dark:border-neutral-800/50 text-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-4 max-w-sm mx-auto">
                  Explore specialized collections from your school&apos;s
                  departments.
                </p>
                <button
                  onClick={() => router.push("/app/library/departments")}
                  className="px-6 py-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 text-gray-600 dark:text-neutral-300 rounded-md text-[10px] font-bold uppercase tracking-widest hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors shadow-sm"
                >
                  Browse Departments
                </button>
              </div>
            )}
          </div>

          <div className="mt-20">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                Community Folders
              </h2>
            </div>

            {isLoadingPublicFolders ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                <FolderCardSkeleton count={publicFoldersFetchLimit} />
              </div>
            ) : displayFolders.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {displayFolders.map((folder) => (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      onClick={() => router.push(`/app/folders/${folder.slug}`)}
                    />
                  ))}
                </div>

                {hasMorePublicFolders && (
                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={() => router.push("/app/discover/folders")}
                      className="px-6 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-md text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-500 hover:border-emerald-500 transition-colors"
                    >
                      View More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-[20vh] flex flex-col items-center justify-center bg-gray-50/30 dark:bg-neutral-900/10 p-8 rounded-md border border-gray-100 dark:border-neutral-800/50 text-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-4 max-w-sm mx-auto">
                  Discover curated reading lists and collections created by the
                  community.
                </p>
                <button
                  onClick={() => router.push("/app/discover/folders")}
                  className="px-6 py-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 text-gray-600 dark:text-neutral-300 rounded-md text-[10px] font-bold uppercase tracking-widest hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors shadow-sm"
                >
                  Browse Folders
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
