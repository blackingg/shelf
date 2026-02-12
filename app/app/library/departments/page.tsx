"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiList, FiX } from "react-icons/fi";
import { DepartmentCard } from "@/app/components/Library/DepartmentCard";
import UserDepartmentBooks from "@/app/components/Department/UserDepartmentBooks";
import { useGetDepartmentsQuery } from "@/app/store/api/departmentsApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store/authSlice";
import { motion, AnimatePresence } from "motion/react";

export default function DepartmentsPage() {
  const router = useRouter();

  const user = useSelector(selectCurrentUser);
  const userDepartment = user?.department?.name || null;
  const userDepartmentSlug = user?.department?.slug;
  const { data: allDepartments, isLoading } = useGetDepartmentsQuery();
  const [viewDepartments, setViewDepartments] = useState(false);
  const toggleViewDepartments = () => setViewDepartments((prev) => !prev);

  return (
    <main className="flex-1">
      <div className="p-8 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">
                Departments
              </h1>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                Browse resources by your school's department
              </p>
            </div>

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
          </div>

          <AnimatePresence>
            {viewDepartments && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-20"
              >
                {allDepartments?.map((department) => (
                  <DepartmentCard
                    key={department.id}
                    department={department}
                    onClick={() =>
                      router.push(`/app/library/departments/${department.id}`)
                    }
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {userDepartment !== null && (
            <div className="pt-8 md:pt-12 border-t border-gray-100 dark:border-neutral-800/50">
              <UserDepartmentBooks departmentSlug={userDepartmentSlug} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
