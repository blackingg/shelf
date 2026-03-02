export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`bg-white  dark:bg-black border border-gray-100 dark:border-white/5 rounded-sm p-10 ${className}`}
  >
    {children}
  </div>
);
