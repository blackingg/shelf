export const PageContainer: React.FC<{
  children: React.ReactNode;
  centered?: boolean;
}> = ({ children, centered = true }) => (
  <div className="min-h-screen bg-white dark:bg-neutral-900">
    <div
      className={`${
        centered
          ? "flex items-center justify-center min-h-[calc(100vh-4rem)]"
          : ""
      } px-4 py-8`}
    >
      {children}
    </div>
  </div>
);
