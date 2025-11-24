
import { FiBookOpen } from "react-icons/fi";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    // bookCount: number;
    color: string;
  };
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
}) => (
  <div
    onClick={onClick}
    className=" flex flex-col items-center md:block group cursor-pointer bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200"
  >
    <div
      className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
    >
      <FiBookOpen className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-semibold text-gray-900 text-sm md:text-lg mb-1">
      {category.name}
    </h3>
    {/* <p className="text-sm text-gray-500">
      {category.bookCount} {category.bookCount === 1 ? "book" : "books"}
    </p> */}
  </div>
);
