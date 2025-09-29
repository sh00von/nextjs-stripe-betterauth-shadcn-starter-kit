import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Try to get session from Better Auth first
    let sessionResponse;
    try {
      sessionResponse = await auth.api.getSession({
        headers: request.headers,
      });
    } catch (error) {
      console.log("Better Auth session failed");
    }

    let session = sessionResponse;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's subscription
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userData } = await request.json();
    
    if (!userData) {
      return NextResponse.json({ error: "User data is required" }, { status: 400 });
    }

    // Get user's subscription using provided user data
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: userData.id,
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
