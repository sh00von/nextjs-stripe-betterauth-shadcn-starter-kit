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
    } catch {
      console.log("Better Auth session failed");
    }

    const session = sessionResponse;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user details with subscription information
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        subscriptions: true,
        _count: {
          select: {
            sessions: true,
            accounts: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data without sensitive information
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      subscription: user.subscriptions[0] || null,
      stats: {
        totalSessions: user._count.sessions,
        totalAccounts: user._count.accounts,
      },
    };

    console.log("Profile API Response (GET):", JSON.stringify(userData, null, 2));
    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userData: providedUserData } = await request.json();
    
    if (!providedUserData) {
      return NextResponse.json({ error: "User data is required" }, { status: 400 });
    }

    // Get user details with subscription information using provided user data
    const user = await prisma.user.findUnique({
      where: {
        id: providedUserData.id,
      },
      include: {
        subscriptions: true,
        _count: {
          select: {
            sessions: true,
            accounts: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data without sensitive information
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      subscription: user.subscriptions[0] || null,
      stats: {
        totalSessions: user._count.sessions,
        totalAccounts: user._count.accounts,
      },
    };

    console.log("Profile API Response (POST):", JSON.stringify(userData, null, 2));
    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Try to get session from Better Auth first
    let sessionResponse;
    try {
      sessionResponse = await auth.api.getSession({
        headers: request.headers,
      });
    } catch {
      console.log("Better Auth session failed");
    }

    const session = sessionResponse;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, image } = await request.json();

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      include: {
        subscriptions: true,
        _count: {
          select: {
            sessions: true,
            accounts: true,
          },
        },
      },
    });

    // Return updated user data without sensitive information
    const userData = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      image: updatedUser.image,
      emailVerified: updatedUser.emailVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      subscription: updatedUser.subscriptions[0] || null,
      stats: {
        totalSessions: updatedUser._count.sessions,
        totalAccounts: updatedUser._count.accounts,
      },
    };

    console.log("Profile API Response (PUT):", JSON.stringify(userData, null, 2));
    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
