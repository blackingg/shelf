"use client";
import { Sidebar } from "@/app/components/Sidebar";
import { PageHeader } from "@/app/components/PageHeader";

export default function FolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-neutral-900">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <PageHeader />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
