"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { LandingFooter } from "@/app/components/Layout/LandingFooter";
import { PublicNavButtons } from "@/app/components/Layout/PublicNavButtons";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showFooter = pathname === "/";

  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-x-hidden selection:bg-primary/10 selection:text-primary">
      <AppHeader rightContent={<PublicNavButtons />} />
      <main>{children}</main>
      {showFooter && <LandingFooter />}
    </div>
  );
}
