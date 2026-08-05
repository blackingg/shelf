import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Exact-match public paths (no auth required).
 */
const PUBLIC_PATHS = ["/", "/privacy", "/terms", "/discover"];

/**
 * Prefix-match public paths. Any route starting with these is public
 * UNLESS it contains a sensitive segment.
 */
const PUBLIC_PREFIXES = [
  "/auth",
  "/admin/auth",
  "/books/",
  "/folders/",
  "/profile/",
  "/library/departments",
  "/library/categories",
];

/**
 * Segments that make an otherwise-public route protected.
 * e.g. /books/some-slug is public, but /books/some-slug/edit is not.
 */
const SENSITIVE_SEGMENTS = ["/edit", "/read", "/upload"];

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Always allow API routes and static assets through
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  // Sensitive sub-routes are never public (e.g. /books/x/edit).
  // Match whole path segments only — a plain `includes` would wrongly gate a
  // public resource whose slug merely starts with these words
  // (e.g. /books/read-me-first contains "/read").
  const isSensitive = SENSITIVE_SEGMENTS.some(
    (s) => pathname.endsWith(s) || pathname.includes(`${s}/`),
  );

  if (!token && (!isPublic || isSensitive)) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|folder|logo|manifest|\\.(?:gif|png|jpe?g|svg|webp)$).*)",
  ],
};
