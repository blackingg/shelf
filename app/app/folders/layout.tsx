import { Sidebar } from "@/app/components/Sidebar";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row  bg-gray-50">
      <Sidebar />
      {children}
    </div>
  );
}
