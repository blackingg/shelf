export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800 p-8 ${className}`}
  >
    {children}
  </div>
);
