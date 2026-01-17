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
  // Get color dynamically based on slug
  const colorClass = getDepartmentColor(department.slug);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-700/50"
    >
      <div
        className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        <FaBuilding className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-lg mb-1">
        {department.name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {department.booksCount} {department.booksCount === 1 ? "book" : "books"}
      </p>
    </div>
  );
};
