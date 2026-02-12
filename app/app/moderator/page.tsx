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
              className={`relative overflow-hidden rounded-md p-6 border transition-colors duration-150 ${
                isUserDept
                  ? "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 cursor-pointer hover:border-gray-300 dark:hover:border-neutral-700"
                  : "bg-gray-50 dark:bg-neutral-900/50 border-gray-100 dark:border-neutral-800 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center text-white ${dept.color}`}
                >
                  <FiBriefcase className="w-5 h-5" />
                </div>
                {dept.pendingCount > 0 && (
                  <span className="px-2.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-md border border-red-200 dark:border-red-900/50">
                    {dept.pendingCount} Pending
                  </span>
                )}
              </div>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {dept.name}
              </h3>

              <div className="flex items-center text-sm text-gray-500 dark:text-neutral-400 mt-4">
                <span>
                  {isUserDept ? "View Submission" : "Access Restricted"}
                </span>
                {isUserDept && <FiArrowRight className="w-4 h-4 ml-2" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
