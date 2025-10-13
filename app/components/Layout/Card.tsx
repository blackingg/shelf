export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 ${className}`}
  >
    {children}
  </div>
);
