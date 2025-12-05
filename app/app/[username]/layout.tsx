"use client";
import { Sidebar } from "@/app/components/Sidebar";
import { PageHeader } from "@/app/components/PageHeader";
import { useState } from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="flex flex-col md:flex-row min-h-screen  bg-gray-50 ">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <PageHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
