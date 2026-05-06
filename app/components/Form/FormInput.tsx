import React, { useState } from "react";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

export const FormInput: React.FC<{
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  autoComplete?: string;
  showPasswordToggle?: boolean;
  required?: boolean;
}> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onKeyPress,
  error,
  icon,
  placeholder,
  autoComplete,
  showPasswordToggle = false,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-neutral-400">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          className={`w-full ${icon ? "pl-10" : "pl-4"} ${
            showPasswordToggle ? "pr-12" : "pr-4"
          } py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-white/5 border rounded-sm focus:ring-0 outline-none transition-colors duration-200 ${
            error
              ? "border-red-500"
              : "border-gray-100 dark:border-white/5 focus:border-primary"
          }`}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
          >
            {showPassword ? (
              <FiEyeOff className="w-5 h-5" />
            ) : (
              <FiEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
          <FiAlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
