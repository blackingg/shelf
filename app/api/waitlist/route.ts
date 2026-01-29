import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

interface WaitlistEntry {
  email: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

const MAX_EMAIL_LENGTH = 254;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateEmail(email: string): {
  isValid: boolean;
  normalized?: string;
  error?: string;
} {
  if (!email || typeof email !== "string") {
    return { isValid: false, error: "Email is required" };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > MAX_EMAIL_LENGTH) {
    return { isValid: false, error: "Email address is too long" };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: "Please provide a valid email address" };
  }

  return { isValid: true, normalized: trimmed };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    const {
      isValid,
      normalized: normalizedEmail,
      error,
    } = validateEmail(email);
    if (!isValid || !normalizedEmail) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("shelfDB");
    const collection = db.collection<WaitlistEntry>("waitlist");

    const existingEntry = await collection.findOne({ email: normalizedEmail });

    if (existingEntry) {
      return NextResponse.json(
        { message: "You're already on the waitlist!", alreadyExists: true },
        { status: 200 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const newEntry: WaitlistEntry = {
      email: normalizedEmail,
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
    };

    await collection.insertOne(newEntry);

    const totalSignups = await collection.countDocuments();

    console.log(`[Waitlist] New signup: ${normalizedEmail}`);

    return NextResponse.json(
      {
        message: "Successfully added to waitlist",
        totalSignups,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Critical error in waitlist signup:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("shelfDB");
    const collection = db.collection<WaitlistEntry>("waitlist");

    const totalSignups = await collection.countDocuments();

    return NextResponse.json(
      { totalSignups },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching waitlist stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
