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
      className="h-4 w-4 text-primary focus:ring-primary border-line dark:checked:bg-primary rounded transition-colors cursor-pointer"
    />
    <label
      htmlFor={id}
      className="ml-2 block text-sm text-foreground cursor-pointer select-none"
    >
      {label}
    </label>
  </div>
);
