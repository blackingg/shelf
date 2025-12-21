export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
