"use client";
import { FaBuilding } from "react-icons/fa6";
import { Department } from "@/app/types/departments";
import { getDepartmentColor } from "@/app/helpers/colors";
import { useUser } from "@/app/services";

interface DepartmentCardProps {
  department: Department;
  onClick: () => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onClick,
}) => {
  const { isAuthenticated } = useUser();
  const iconColorClass = getDepartmentColor(department.slug);
  const resourcesCount = department.booksCount || 0;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-neutral-900 rounded-md p-4 md:p-5 border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex flex-col min-w-0">
          {!isAuthenticated && (
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-500 line-clamp-1 mb-0.5">
              {department.school?.shortName}
            </p>
          )}

          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 line-clamp-1">
            {department.faculty || "Department"}
          </p>
        </div>

        <div className="w-8 h-8 shrink-0 rounded-md border border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800/70 flex items-center justify-center">
          <FaBuilding className={`w-3.5 h-3.5 ${iconColorClass}`} />
        </div>
      </div>

      <h3 className="font-medium text-gray-900 dark:text-neutral-100 text-sm md:text-base mb-1 line-clamp-2">
        {department.name}
      </h3>

      <p className="text-xs text-gray-500 dark:text-neutral-400">
        {resourcesCount} {resourcesCount === 1 ? "resource" : "resources"}
      </p>
    </div>
  );
};

export const DepartmentCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-md p-4 md:p-5 border border-gray-200 dark:border-neutral-800 animate-pulse">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="h-3 w-2/3 bg-gray-100 dark:bg-neutral-800 rounded-md" />
        <div className="w-8 h-8 rounded-md border border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800/70" />
      </div>

      <div className="space-y-2 mb-2">
        <div className="h-4 w-4/5 bg-gray-100 dark:bg-neutral-800 rounded-md" />
        <div className="h-4 w-3/5 bg-gray-100 dark:bg-neutral-800 rounded-md" />
      </div>

      <div className="h-3 w-2/5 bg-gray-50 dark:bg-neutral-800/50 rounded-md" />
    </div>
  );
};
