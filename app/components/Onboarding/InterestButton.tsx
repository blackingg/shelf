import { FiCheck } from "react-icons/fi";

export const InterestButton: React.FC<{
  name: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}> = ({ name, icon, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2 rounded-xl border-2 text-sm transition-all cursor-pointer ${
      isSelected
        ? "border-primary bg-primary/5 text-primary"
        : "border-gray-200 text-gray-800 hover:border-gray-300"
    }`}
  >
    <span className="flex items-center space-x-2">
      {icon}
      <span>{name}</span>
    </span>
    {isSelected && <FiCheck className="w-4 h-4 text-primary" />}
  </button>
);
