"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/services";
import { LoadingScreen } from "../Loader/LoadingScreen";
import { UserRole } from "@/app/types/user";

const MODERATOR_ROLES: UserRole[] = ["MODERATOR", "ADMIN", "SUPER_ADMIN"];

export default function ModeratorProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { me, hasToken, isAuthenticated, isLoading, isPending, isFetching } =
    useUser();

  const isResolvingSession =
    hasToken && !me && (isLoading || isPending || isFetching);

  useEffect(() => {
    if (isResolvingSession) return;

    if (!hasToken || !isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (!MODERATOR_ROLES.includes(me?.role as UserRole)) {
      router.replace("/discover");
    }
  }, [hasToken, isAuthenticated, me, isResolvingSession, router]);

  if (isResolvingSession) return <LoadingScreen />;

  if (
    !hasToken ||
    !isAuthenticated ||
    !MODERATOR_ROLES.includes(me?.role as UserRole)
  ) {
    return null;
  }

  return <>{children}</>;
}