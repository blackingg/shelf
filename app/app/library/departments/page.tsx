"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiGrid } from "react-icons/fi";
import { USER_DEPARTMENTS } from "@/app/lib/constants";
import { getFromLocalStorage } from "@/app/helpers/localStorage";
import { PageHeader } from "@/app/components/Library/PageHeader";
import { DepartmentCard } from "@/app/components/Library/DepartmentCard";
import { DEPARTMENTS } from "@/app/types/departments";

const userDepartment = getFromLocalStorage(USER_DEPARTMENTS);

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  if (userDepartment != null) {
    router.push(`/app/library/departments/${userDepartment}`);
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <PageHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <FiGrid className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Available Departments
            </h1>
          </div>
          <p className="text-gray-600">
            Browse books by your school's department
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {DEPARTMENTS.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onClick={() =>
                router.push(`/app/library/departments/${department.id}`)
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
}
