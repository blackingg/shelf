import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "../_helpers/cookies";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * POST /api/auth/logout
 * Forwards the logout request to the backend (with the access token),
 * then clears all auth cookies regardless of backend response.
 */
export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    // Best-effort backend logout (invalidate server-side session)
    if (accessToken) {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      }).catch(() => {
        // Swallow errors — we clear cookies regardless
      });
    }

    const response = NextResponse.json(
      { success: true },
      { status: 200 },
    );
    clearAuthCookies(response);

    return response;
  } catch (error) {
    // Even on error, clear cookies to ensure user is logged out client-side
    const response = NextResponse.json(
      { success: true },
      { status: 200 },
    );
    clearAuthCookies(response);
    return response;
  }
}
