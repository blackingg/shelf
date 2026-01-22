"use client";
import { Sidebar } from "@/app/components/Sidebar";
import { PageHeader } from "@/app/components/PageHeader";

import { usePathname } from "next/navigation";

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isReaderPage = pathname?.includes("/read");

  if (isReaderPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-neutral-900">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <PageHeader />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
