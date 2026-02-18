export default function ViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-neutral-900 overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar">{children}</div>
    </div>
  );
}
