export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  icon,
  className = "",
}) => {
  const baseStyles =
    "w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer";

  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 shadow-lg hover:shadow-xl",
    secondary:
      "bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-neutral-700",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
  };

  const disabledStyles =
    "bg-gray-300 dark:bg-neutral-800 text-gray-500 dark:text-gray-500 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${
        disabled || isLoading ? disabledStyles : variantStyles[variant]
      } ${className}`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {icon}
        </>
      )}
    </button>
  );
};
