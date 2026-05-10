export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white  dark:bg-black border border-gray-100 dark:border-white/5 rounded-sm p-10 ${className}`}
  >
    {children}
  </div>
);
