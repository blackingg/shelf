import { FiBookOpen } from "react-icons/fi";
import { Category } from "@/app/types/categories";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="flex flex-col items-center md:items-start group cursor-pointer bg-white dark:bg-neutral-900 rounded-md p-5 border border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-colors duration-150"
  >
    <div className="w-9 h-9 rounded-md bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
      <FiBookOpen className="w-4 h-4 text-gray-500 dark:text-neutral-400" />
    </div>
    <h3 className="font-medium text-gray-900 dark:text-neutral-100 text-sm mb-0.5">
      {category.name}
    </h3>
    <p className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
      {category.booksCount}{" "}
      {category.booksCount === 1 ? "resource" : "resources"}
    </p>
  </div>
);
