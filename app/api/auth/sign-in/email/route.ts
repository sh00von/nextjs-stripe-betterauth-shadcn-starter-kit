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
  } catch (error: any) {
    console.error("Error signing in:", error);
    
    // Handle Better Auth API errors
    if (error?.status === 'BAD_REQUEST' && error?.body?.message) {
      return NextResponse.json(
        { error: error.body.message },
        { status: 400 }
      );
    }
    
    // Handle other API errors
    if (error?.message) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
