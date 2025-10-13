export const PageContainer: React.FC<{
  children: React.ReactNode;
  centered?: boolean;
}> = ({ children, centered = true }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
    <div
      className={`${
        centered
          ? "flex items-center justify-center min-h-[calc(100vh-4rem)]"
          : ""
      } px-6 py-12`}
    >
      {children}
    </div>
  </div>
);
