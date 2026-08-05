export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-surface border border-line-subtle rounded-sm p-10 ${className}`}
  >
    {children}
  </div>
);
