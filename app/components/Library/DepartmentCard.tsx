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

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-neutral-900 rounded-md p-5 border border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-colors duration-150"
    >
      <div
        className={`w-9 h-9 rounded-md ${colorClass} flex items-center justify-center mb-3`}
      >
        <FaBuilding className="w-4 h-4 text-white" />
      </div>
      <h3 className="font-medium text-gray-900 dark:text-neutral-100 text-sm mb-0.5">
        {department.name}
      </h3>
      <p className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
        {department.booksCount}{" "}
        {department.booksCount === 1 ? "resource" : "resources"}
      </p>
    </div>
  );
};
