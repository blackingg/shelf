import { FiCheck } from "react-icons/fi";

export const InterestButton: React.FC<{
  name: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}> = ({ name, icon, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2.5 rounded-sm border text-sm font-medium transition-colors cursor-pointer w-full min-w-0 ${
      isSelected
        ? "border-primary bg-primary/5 text-primary"
        : "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:border-gray-200 dark:hover:border-white/10"
    }`}
  >
    <span className="shrink-0 text-base leading-none">{icon}</span>
    <span className="truncate flex-1 text-left">{name}</span>
    {isSelected && (
      <FiCheck className="shrink-0 w-4 h-4 text-primary ml-auto" />
    )}
  </button>
);
