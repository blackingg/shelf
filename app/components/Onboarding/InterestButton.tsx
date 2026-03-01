import { FiCheck } from "react-icons/fi";

export const InterestButton: React.FC<{
  name: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}> = ({ name, icon, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-2.5 rounded-sm border text-sm font-medium transition-colors cursor-pointer ${
      isSelected
        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400"
        : "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:border-gray-200 dark:hover:border-white/10"
    }`}
  >
    <span className="flex items-center space-x-3">
      {icon}
      <span>{name}</span>
    </span>
    {isSelected && <FiCheck className="w-4 h-4 text-emerald-600" />}
  </button>
);
