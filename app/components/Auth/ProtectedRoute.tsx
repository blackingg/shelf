"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/app/store/authSlice";
import { useGetMeQuery } from "@/app/services/user/hooks";
import { LoadingScreen } from "../Loader/LoadingScreen";

const PUBLIC_PATHS = ["/", "/docs/privacy", "/docs/terms"];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const [isChecking, setIsChecking] = useState(true);

  const isPublicPath = pathname
    ? PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/app/auth")
    : true;

  const shouldFetchMe = isAuthenticated && !isPublicPath;
  const { error: meError, isLoading: isLoadingMe } = useGetMeQuery({
    enabled: shouldFetchMe,
  });

  // Handle 401/403 — token is expired or invalid, force logout
  useEffect(() => {
    if (!meError) return;
    const status = (meError as { status?: number })?.status;
    const detail = (meError as { data?: { detail?: string } })?.data?.detail;

    if (status === 401 || (status === 403 && detail === "Not authenticated")) {
      dispatch(logout());
      router.replace(
        `/app/auth/login?redirect=${encodeURIComponent(pathname ?? "/")}`,
      );
    }
  }, [meError, dispatch, router, pathname]);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!pathname) return;
    if (isPublicPath) {
      setIsChecking(false);
      return;
    }
    if (!isAuthenticated) {
      router.replace(
        `/app/auth/login?redirect=${encodeURIComponent(pathname)}`,
      );
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, pathname, router, isPublicPath]);

  if (isPublicPath) return <>{children}</>;
  if (isChecking) return <LoadingScreen />;
  if (!isAuthenticated) return null;
  if (isLoadingMe && !currentUser) return <LoadingScreen />;

  return <>{children}</>;
}
