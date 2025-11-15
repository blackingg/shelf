import { FaBuilding } from "react-icons/fa6";

interface DepartmentCardProps {
  department: {
    id: string;
    name: string;
    // bookCount: number;
    color: string;
  };
  onClick: () => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="group cursor-pointer bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200"
  >
    <div
      className={`w-12 h-12 rounded-lg ${department.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
    >
      <FaBuilding className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-semibold text-gray-900 text-lg mb-1">
      {department.name}
    </h3>
    {/* <p className="text-sm text-gray-500">
      {department.bookCount} {department.bookCount === 1 ? "book" : "books"}
    </p> */}
  </div>
);
