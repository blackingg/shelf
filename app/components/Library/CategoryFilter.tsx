import { FiGrid } from "react-icons/fi";

export const CategoryFilter: React.FC<{
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ categories, activeCategory, onCategoryChange }) => (
  <div className="flex items-center space-x-3 overflow-x-auto pb-2">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => onCategoryChange(category)}
        className={`px-5 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
          activeCategory === category
            ? "bg-emerald-600 text-white shadow-lg"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {category}
      </button>
    ))}
    <button className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200">
      <FiGrid className="w-5 h-5" />
    </button>
  </div>
);
