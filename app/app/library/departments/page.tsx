"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DepartmentCard,
  DepartmentCardSkeleton,
} from "@/app/components/Library/DepartmentCard";
import UserDepartmentBooks from "@/app/components/Department/UserDepartmentBooks";
import { SortFilter } from "@/app/components/Library/SortFilter";
import { useDepartments } from "@/app/services";
import { useGetSchoolsQuery } from "@/app/services/onboarding";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "@/app/store";
import { motion, AnimatePresence } from "motion/react";
import { useResponsiveLimit } from "@/app/hooks/useResponsiveLimit";
import { FiFilter, FiChevronDown, FiList, FiX } from "react-icons/fi";

export default function DepartmentsPage() {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);

  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(
    user?.school?.id || "",
  );

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: schools = [] } = useGetSchoolsQuery();
  const [viewDepartments, setViewDepartments] = useState(!isAuthenticated);

  const { departments: allDepartments, isLoading } = useDepartments(
    selectedSchoolId ? { school_id: selectedSchoolId } : {},
  );

  const userDepartment = allDepartments.find(
    (d) => d.id === user?.department?.id,
  );
  const userDepartmentName = user?.department?.name;
  const userDepartmentSlug = userDepartment?.slug || null;

  useEffect(() => {
    if (user?.school?.id && !selectedSchoolId) {
      setSelectedSchoolId(user.school.id);
    }
  }, [user?.school?.id]);

  const selectedSchool = schools.find((s) => s.id === selectedSchoolId);
  const departmentSkeletonCount = useResponsiveLimit(
    { base: 2, md: 3, lg: 5 },
    4,
    10,
  );
  const toggleViewDepartments = () => setViewDepartments((prev) => !prev);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-8 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">
                Departments
              </h1>
              {userDepartmentName ? (
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
                  Browse resources by your school's department
                </p>
              ) : (
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  Browse resources available, filter by school to find your
                  department's resources
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              {!isAuthenticated && (
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
                  className="w-full md:w-auto"
                />
              )}

              {isAuthenticated && (
                <button
                  onClick={toggleViewDepartments}
                  className="flex items-center gap-3 px-6 py-3 bg-gray-50/50 dark:bg-neutral-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md border border-gray-100 dark:border-neutral-800 transition-all group"
                >
                  {!viewDepartments ? (
                    <FiList className="w-5 h-5 text-emerald-600 dark:text-emerald-500 group-hover:scale-110 transition-transform" />
                  ) : (
                    <FiX className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  )}
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors">
                    {!viewDepartments ? "Explore All" : "Close Gallery"}
                  </span>
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {viewDepartments && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-20">
                    {Array.from({ length: departmentSkeletonCount }).map(
                      (_, i) => (
                        <DepartmentCardSkeleton key={i} />
                      ),
                    )}
                  </div>
                ) : allDepartments.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-20">
                    {allDepartments.map((department) => (
                      <DepartmentCard
                        key={department.id}
                        department={department}
                        onClick={() =>
                          router.push(
                            `/app/library/departments/${department.slug}`,
                          )
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-[40vh] bg-gray-50/30 dark:bg-neutral-900/10 p-12 md:p-16 rounded-md border border-gray-100 dark:border-neutral-800/50 text-center flex flex-col items-center justify-center mb-20">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                      No departments found for this selection.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {userDepartmentName && (
            <div className="pt-8 md:pt-12 border-t border-gray-100 dark:border-neutral-800/50">
              <UserDepartmentBooks
                departmentSlug={userDepartmentSlug}
                departmentName={userDepartmentName}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
