"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FiBriefcase, FiArrowRight } from "react-icons/fi";

// Mock Departments Data
const departments = [
  {
    id: "1",
    name: "Computer Science",
    slug: "computer-science",
    pendingCount: 12,
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "Business Administration",
    slug: "business-admin",
    pendingCount: 5,
    color: "bg-emerald-500",
  },
  {
    id: "3",
    name: "Mechanical Engineering",
    slug: "mechanical-engineering",
    pendingCount: 8,
    color: "bg-orange-500",
  },
  {
    id: "4",
    name: "Medicine",
    slug: "medicine",
    pendingCount: 15,
    color: "bg-rose-500",
  },
];

export default function ModeratorPage() {
  const router = useRouter();
  const userDepartmentSlug = "computer-science"; // Mock user department

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Moderator Dashboard
        </h1>
        <p className="text-gray-500 dark:text-neutral-400">
          Select your department to review pending submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept, index) => {
          const isUserDept = dept.slug === userDepartmentSlug;

          return (
            <div
              key={dept.id}
              onClick={() => {
                if (isUserDept) {
                  router.push(`/app/moderator/${dept.slug}`);
                }
              }}
              className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 ${
                isUserDept
                  ? "bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 cursor-pointer hover:shadow-lg hover:border-emerald-500/50 dark:hover:border-emerald-500/50 group"
                  : "bg-gray-50 dark:bg-neutral-900/50 border-gray-200 dark:border-neutral-800 opacity-60 cursor-not-allowed grayscale-[0.5]"
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${dept.color}`}
                >
                  <FiBriefcase className="w-6 h-6" />
                </div>
                {dept.pendingCount > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full">
                    {dept.pendingCount} Pending
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {dept.name}
              </h3>

              <div className="flex items-center text-sm font-medium text-gray-500 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mt-4">
                <span>
                  {isUserDept ? "View Submission" : "Access Restricted"}
                </span>
                {isUserDept && (
                  <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
