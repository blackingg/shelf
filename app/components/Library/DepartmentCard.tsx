import { FaBuilding } from "react-icons/fa6";
import { Department } from "@/app/types/departments";
import { getDepartmentColor } from "@/app/helpers/colors";

interface DepartmentCardProps {
  department: Department;
  onClick: () => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onClick,
}) => {
  const colorClass = getDepartmentColor(department.slug);
  const resourcesCount = department.booksCount || 0;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-neutral-900 rounded-md p-4 md:p-5 border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${colorClass}`} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 line-clamp-1">
            {department.faculty || "Department"}
          </p>
        </div>

        <div className="w-8 h-8 rounded-md border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/70 flex items-center justify-center shrink-0">
          <FaBuilding className="w-3.5 h-3.5 text-gray-500 dark:text-neutral-400" />
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
