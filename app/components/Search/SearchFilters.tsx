"use client";

type FilterValue = "all" | "book" | "folder";

interface SearchFiltersProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const filters: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Books", value: "book" },
  { label: "Folders", value: "folder" },
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-1">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 ${
            value === filter.value
              ? "bg-gray-900 dark:bg-white text-white dark:text-neutral-900"
              : "text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
