export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  loader?: React.ReactNode;
}> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  icon,
  className = "",
  loader,
}) => {
  const baseStyles =
    "w-full py-3 px-4 rounded-sm font-medium transition-colors duration-150 flex items-center justify-center space-x-2 cursor-pointer focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    secondary:
      "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10",
    outline:
      "border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10",
  };

  const activeStyles =
    disabled || isLoading
      ? ""
      : variantStyles[variant as keyof typeof variantStyles] ||
        variantStyles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${activeStyles} ${className}`}
    >
      {isLoading ? (
        <>
          {loader ? (
            <span className="mr-2">{loader}</span>
          ) : (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
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
