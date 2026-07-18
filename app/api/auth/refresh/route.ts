import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies, clearAuthCookies } from "../_helpers/cookies";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * POST /api/auth/refresh
 * Reads the httpOnly refreshToken cookie, sends it to the backend,
 * and sets new cookies on success. The client never sees the refresh token.
 */
export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { detail: "No refresh token" },
        { status: 401 },
      );
    }

    const backendRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!backendRes.ok) {
      const response = NextResponse.json(
        { detail: "Token refresh failed" },
        { status: 401 },
      );
      clearAuthCookies(response);
      return response;
    }

    const data = await backendRes.json();

    if (!data?.accessToken || !data?.refreshToken) {
      const response = NextResponse.json(
        { detail: "Unexpected refresh response" },
        { status: 401 },
      );
      clearAuthCookies(response);
      return response;
    }

    const response = NextResponse.json({ success: true }, { status: 200 });
    setAuthCookies(
      response,
      data.accessToken,
      data.refreshToken,
      data.expiresIn,
    );

    return response;
  } catch (error) {
    const response = NextResponse.json(
      { detail: "Refresh proxy error" },
      { status: 500 },
    );
    clearAuthCookies(response);
    return response;
  }
}
