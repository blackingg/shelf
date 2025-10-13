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
      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
    />
    <label
      htmlFor={id}
      className="ml-2 block text-sm text-gray-700"
    >
      {label}
    </label>
  </div>
);
