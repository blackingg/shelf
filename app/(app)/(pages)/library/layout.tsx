import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Library",
  description: "Manage your bookmarked resources, folders, and donated books on Shelf.",
};

import { LoadingScreen } from "@/app/components/Loader/LoadingScreen";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
