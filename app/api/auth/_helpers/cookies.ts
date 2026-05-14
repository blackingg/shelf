import { NextResponse } from "next/server";

const IS_PROD = process.env.NODE_ENV === "production";

/**
 * Sets auth cookies on a NextResponse.
 * - accessToken: regular cookie (readable by client JS for Bearer header)
 * - refreshToken: httpOnly cookie (only readable by server/proxy routes)
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
) {
  // Access token — readable by the client fetcher (short-lived, 1hr)
  response.cookies.set("accessToken", accessToken, {
    httpOnly: false,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: expiresIn,
  });

  // Refresh token — httpOnly, only our proxy routes can read it
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Clears both auth cookies.
 */
export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
}
