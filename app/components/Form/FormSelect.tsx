"use client";
import React from "react";
import Select, { Props as SelectProps } from "react-select";
import { useTheme } from "next-themes";

interface OptionType {
  value: string;
  label: string;
}

interface FormSelectProps<
  Option = OptionType,
  IsMulti extends boolean = false,
> extends Omit<SelectProps<Option, IsMulti>, "theme"> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
}

export function FormSelect<
  Option = OptionType,
  IsMulti extends boolean = false,
>({
  label,
  icon,
  error,
  className = "",
  ...props
}: FormSelectProps<Option, IsMulti>) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      paddingLeft: icon ? "2.25rem" : "0.5rem",
      borderRadius: "0.125rem", // rounded-sm
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#f9fafb",
      borderColor: error
        ? "#ef4444"
        : state.isFocused
          ? "#059669"
          : isDark
            ? "rgba(255, 255, 255, 0.05)"
            : "#f3f4f6",
      boxShadow: "none",
      minHeight: "48px",
      transition: "border-color 0.2s ease",
      "&:hover": {
        borderColor: error ? "#ef4444" : "#059669",
      },
      cursor: "pointer",
    }),
    input: (base: any) => ({
      ...base,
      color: isDark ? "#ffffff" : "#111827",
      fontSize: "0.875rem",
      fontFamily: "inherit",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDark ? "#ffffff" : "#111827",
      fontSize: "0.875rem",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#9ca3af",
      fontSize: "0.875rem",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDark ? "#000000" : "#ffffff",
      border: isDark
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid #f3f4f6",
      borderRadius: "0.125rem",
      boxShadow: "none",
      zIndex: 100,
      marginTop: "4px",
      padding: "4px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#059669"
        : state.isFocused
          ? isDark
            ? "rgba(255, 255, 255, 0.08)"
            : "#f3f4f6"
          : "transparent",
      color: state.isSelected ? "#ffffff" : isDark ? "#ffffff" : "#111827",
      fontSize: "0.875rem",
      padding: "10px 14px",
      borderRadius: "0.125rem",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#059669",
      },
    }),
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-neutral-500 pointer-events-none w-5 h-5 flex items-center justify-center">
            {icon}
          </div>
        )}
        <Select<Option, IsMulti>
          styles={customStyles}
          classNamePrefix="react-select"
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
