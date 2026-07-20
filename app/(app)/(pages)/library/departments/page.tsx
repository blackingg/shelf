"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DepartmentCard,
  DepartmentCardSkeleton,
} from "@/app/components/Library/DepartmentCard";
import UserDepartmentBooks from "@/app/components/Department/UserDepartmentBooks";
import { SortFilter } from "@/app/components/Library/SortFilter";
import { useDepartments, useUser } from "@/app/services";
import { useGetSchoolsQuery } from "@/app/services/onboarding";
import { useResponsiveLimit } from "@/app/hooks/useResponsiveLimit";
import { FiBriefcase, FiGrid } from "react-icons/fi";

export default function DepartmentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { me: user, isAuthenticated, isLoading: isUserLoading } = useUser();

  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const { data: schools = [] } = useGetSchoolsQuery();

  const { departments: allDepartments, isLoading: isDepartmentsLoading } =
    useDepartments(selectedSchoolId ? { school_id: selectedSchoolId } : {});

  const userDepartment = allDepartments.find(
    (d) => d.id === user?.department?.id,
  );
  const userDepartmentName = user?.department?.name;
  const userDepartmentSlug = userDepartment?.slug || null;

  // Users without a department (and guests) only ever see the full list
  const hasOwnTab = isAuthenticated && !!userDepartmentName;
  const showAll = !hasOwnTab || searchParams.get("view") === "gallery";

  useEffect(() => {
    if (!isUserLoading && user?.school?.id && !selectedSchoolId) {
      setSelectedSchoolId(user.school.id);
    }
  }, [isUserLoading, user?.school?.id, selectedSchoolId]);

  const departmentSkeletonCount = useResponsiveLimit(
    { base: 2, md: 3, lg: 5 },
    4,
    10,
  );

  const selectTab = (tab: "mine" | "all") => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") {
      params.set("view", "gallery");
    } else {
      params.delete("view");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const tabs = [
    { id: "mine" as const, label: "My Department", icon: FiBriefcase },
    { id: "all" as const, label: "All Departments", icon: FiGrid },
  ];
  const activeTab = showAll ? "all" : "mine";

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-10">
            <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tighter">
              Departments
            </h1>

            {showAll && (
              <SortFilter
                value={selectedSchoolId}
                onValueChange={setSelectedSchoolId}
                options={[
                  { value: "", label: "All Schools" },
                  ...schools.map((school) => ({
                    value: school.id,
                    label: school.name,
                  })),
                ]}
                labelPrefix="School:"
                className="w-full sm:w-auto"
              />
            )}
          </div>

          {hasOwnTab && (
            <div className="flex gap-1 mb-6 md:mb-10 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => selectTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-150 shrink-0 ${
                      isActive
                        ? "bg-gray-100 dark:bg-white/5 text-foreground"
                        : "text-muted hover:bg-wash hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {showAll ? (
            isDepartmentsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
                {Array.from({ length: departmentSkeletonCount }).map((_, i) => (
                  <DepartmentCardSkeleton key={i} />
                ))}
              </div>
            ) : allDepartments.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
                {allDepartments.map((department) => (
                  <DepartmentCard
                    key={department.id}
                    department={department}
                    onClick={() =>
                      router.push(`/library/departments/${department.slug}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="h-[40vh] bg-gray-50/30 dark:bg-neutral-900/10 p-8 md:p-16 rounded-md border border-line-subtle text-center flex flex-col items-center justify-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-faint">
                  No departments found for this selection.
                </p>
              </div>
            )
          ) : (
            <UserDepartmentBooks
              departmentSlug={userDepartmentSlug}
              departmentName={userDepartmentName!}
            />
          )}
        </div>
      </div>
    </div>
  );
}
