import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Error signing in:", error);
    
    // Handle Better Auth API errors
    if (error && typeof error === 'object' && 'status' in error && error.status === 'BAD_REQUEST' && 'body' in error && error.body && typeof error.body === 'object' && 'message' in error.body) {
      return NextResponse.json(
        { error: (error.body as { message: string }).message },
        { status: 400 }
      );
    }
    
    // Handle other API errors
    if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json(
        { error: (error as { message: string }).message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
