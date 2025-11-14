import { FiSearch } from "react-icons/fi";

export const SearchBar: React.FC<{
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ placeholder = "Search your favourite books", value, onChange }) => (
  <div className="relative">
    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-96 pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
    />
  </div>
);
