export const Checkbox: React.FC<{
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
}> = ({ id, checked, onChange, label }) => (
  <div className="flex items-center">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:bg-emerald-600 rounded transition-colors cursor-pointer"
    />
    <label
      htmlFor={id}
      className="ml-2 block text-sm text-gray-700 dark:text-neutral-300 cursor-pointer select-none"
    >
      {label}
    </label>
  </div>
);
