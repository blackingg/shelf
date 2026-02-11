"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/app/store/authSlice";
import { useGetMeQuery } from "@/app/store/api/usersApi";
import { LoadingScreen } from "@/app/components/LoadingScreen";

const PUBLIC_PATHS = ["/"];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useGetMeQuery(undefined, { skip: !isAuthenticated });

  useEffect(() => {
    if (!pathname) return;

    const isPublicPath =
      PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/app/auth");

    if (!isAuthenticated && !isPublicPath) {
      router.push("/app/auth/login");
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, pathname, router]);

  const isPublicPath = pathname
    ? PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/app/auth")
    : true;

  if (isPublicPath) {
    return <>{children}</>;
  }

  if (isChecking || !isAuthenticated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
