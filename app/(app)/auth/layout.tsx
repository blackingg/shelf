"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/app/services";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // verify-email is part of an in-progress flow and may legitimately be
  // visited while a session exists — never bounce it.
  const isGuarded = !pathname.startsWith("/auth/verify-email");

  useEffect(() => {
    if (!isLoading && isAuthenticated && isGuarded) {
      router.replace("/discover");
    }
  }, [isLoading, isAuthenticated, isGuarded, router]);

  if (isGuarded && !isLoading && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
