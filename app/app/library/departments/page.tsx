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
    <main className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <div
            onClick={toggleViewDepartments}
            className="flex items-center space-x-3 mb-2 cursor-pointer"
          >
            {!viewDepartments ? (
              <FiList className="w-8 h-8 text-emerald-600" />
            ) : (
              <FiX className="w-8 h-8 text-emerald-600" />
            )}

            <h1 className="text-3xl font-bold text-gray-900">
              View All Departments
            </h1>
          </div>
          <p className="text-gray-600">
            Browse books by your school's department
          </p>
        </div>

        {viewDepartments && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {allDepartments?.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onClick={() =>
                  router.push(`/app/library/departments/${department.id}`)
                }
              />
            ))}
          </div>
        )}

        {userDepartment !== null && (
          <UserDepartmentBooks departmentSlug={userDepartmentSlug} />
        )}
      </div>
    </main>
  );
}
