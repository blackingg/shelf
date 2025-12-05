"use client";
import { Sidebar } from "@/app/components/Sidebar";
import { PageHeader } from "@/app/components/PageHeader";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function FolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const pathname = usePathname();
  const isReaderPage = pathname?.includes("/read");

  if (isReaderPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen  bg-gray-50 ">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <PageHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
