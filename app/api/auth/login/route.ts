import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "../_helpers/cookies";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * POST /api/auth/login
 * Proxies login to the backend, sets auth cookies, returns only { user }.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    if (!data?.tokens?.accessToken || !data?.tokens?.refreshToken) {
      return NextResponse.json(
        { detail: "Unexpected authentication response" },
        { status: 502 },
      );
    }

    // Set cookies with tokens, return only user to browser
    const response = NextResponse.json(
      { user: data.user },
      { status: 200 },
    );
    setAuthCookies(
      response,
      data.tokens.accessToken,
      data.tokens.refreshToken,
      data.tokens.expiresIn,
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { detail: "Login proxy error" },
      { status: 500 },
    );
  }
}
