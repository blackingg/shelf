import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

interface WaitlistEntry {
  email: string;
  timestamp: string;
  ip?: string;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!isValidEmail(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const client = await clientPromise;
    const db = client.db("waitlistDB");
    const collection = db.collection<WaitlistEntry>("waitlist");

    const existingEntry = await collection.findOne({
      email: normalizedEmail,
    });

    if (existingEntry) {
      return NextResponse.json(
        { message: "Email already registered", alreadyExists: true },
        { status: 200 }
      );
    }

    const newEntry: WaitlistEntry = {
      email: normalizedEmail,
      timestamp: new Date().toISOString(),
    };

    await collection.insertOne(newEntry);

    const totalSignups = await collection.countDocuments();

    console.log(
      `New waitlist signup: ${normalizedEmail} at ${newEntry.timestamp}`
    );

    return NextResponse.json(
      {
        message: "Successfully added to waitlist",
        totalSignups,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing waitlist signup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("waitlistDB");
    const collection = db.collection<WaitlistEntry>("waitlist");

    const totalSignups = await collection.countDocuments();

    return NextResponse.json({ totalSignups });
  } catch (error) {
    console.error("Error fetching waitlist stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
